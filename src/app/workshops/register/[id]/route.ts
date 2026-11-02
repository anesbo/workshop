import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  putRegistrationSchema,
  patchRegistrationSchema,
  registrationIdParamSchema,
} from '@/validators/registration.validator';
import { handleApiError, AppError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

async function resolveParams(params: RouteContext['params']): Promise<{ id: string }> {
  return params instanceof Promise ? await params : params;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const rawParams = await resolveParams(context.params);
    const { id } = registrationIdParamSchema.parse(rawParams);

    const registration = await prisma.registration.findUnique({
      where: { id },
    });

    if (!registration) {
      throw new AppError('Registration record not found', 404);
    }

    return NextResponse.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const rawParams = await resolveParams(context.params);
    const { id } = registrationIdParamSchema.parse(rawParams);

    const body = await request.json();
    const validatedData = putRegistrationSchema.parse(body);

    const updated = await prisma.registration.update({
      where: { id },
      data: {
        name: validatedData.name,
        secondName: validatedData.secondName,
        email: validatedData.email,
        specialite: validatedData.specialite,
        note: validatedData.note,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Registration updated successfully',
      data: updated,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const rawParams = await resolveParams(context.params);
    const { id } = registrationIdParamSchema.parse(rawParams);

    const body = await request.json();
    const validatedData = patchRegistrationSchema.parse(body);

    const updated = await prisma.registration.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      message: 'Registration partially updated successfully',
      data: updated,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const rawParams = await resolveParams(context.params);
    const { id } = registrationIdParamSchema.parse(rawParams);

    await prisma.registration.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Registration deleted successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}

