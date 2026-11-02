import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function handleApiError(err: unknown): NextResponse {
  // Zod validation error
  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation error',
        errors: err.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  // Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          message: 'Email already registered for this workshop',
        },
        { status: 409 }
      );
    }

    if (err.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          message: 'Registration record not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Database operation failed',
      },
      { status: 400 }
    );
  }

  // Custom AppError
  if (err instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: err.statusCode }
    );
  }

  // Fallback 500
  console.error('Unhandled API Error:', err);
  return NextResponse.json(
    {
      success: false,
      message: 'Internal server error',
    },
    { status: 500 }
  );
}

