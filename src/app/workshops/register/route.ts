import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createRegistrationSchema } from '@/validators/registration.validator';
import { handleApiError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createRegistrationSchema.parse(body);

    const registration = await prisma.registration.create({
      data: validatedData,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Registration created successfully',
        data: registration,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

