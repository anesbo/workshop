import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import {
  createRegistrationSchema,
  putRegistrationSchema,
  patchRegistrationSchema,
  registrationIdParamSchema,
} from '../validators/registration.validator';
import { AppError } from '../middlewares/error.middleware';

export const createRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createRegistrationSchema.parse(req.body);

    const registration = await prisma.registration.create({
      data: validatedData,
    });

    res.status(201).json({
      success: true,
      message: 'Registration created successfully',
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRegistrations = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

export const getRegistrationById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = registrationIdParamSchema.parse(req.params);

    const registration = await prisma.registration.findUnique({
      where: { id },
    });

    if (!registration) {
      throw new AppError('Registration record not found', 404);
    }

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRegistrationFull = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = registrationIdParamSchema.parse(req.params);
    const validatedData = putRegistrationSchema.parse(req.body);

    const updatedRegistration = await prisma.registration.update({
      where: { id },
      data: {
        name: validatedData.name,
        secondName: validatedData.secondName,
        email: validatedData.email,
        specialite: validatedData.specialite,
        note: validatedData.note,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Registration updated successfully',
      data: updatedRegistration,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRegistrationPartial = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = registrationIdParamSchema.parse(req.params);
    const validatedData = patchRegistrationSchema.parse(req.body);

    const updatedRegistration = await prisma.registration.update({
      where: { id },
      data: validatedData,
    });

    res.status(200).json({
      success: true,
      message: 'Registration partially updated successfully',
      data: updatedRegistration,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = registrationIdParamSchema.parse(req.params);

    await prisma.registration.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Registration deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
