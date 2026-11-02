import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../config/prisma';
import { registerAdminSchema, loginAdminSchema } from '../validators/auth.validator';
import { AppError } from '../middlewares/error.middleware';

export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = registerAdminSchema.parse(req.body);

    const existingAdmin = await prisma.admin.findUnique({
      where: { email: validatedData.email },
    });

    if (existingAdmin) {
      throw new AppError('Admin with this email already exists', 409);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

    const admin = await prisma.admin.create({
      data: {
        email: validatedData.email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    const secret = process.env.JWT_SECRET || 'super-secure-random-jwt-secret-key-change-me';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    const signOptions: SignOptions = {
      expiresIn: expiresIn as unknown as SignOptions['expiresIn'],
    };

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      secret,
      signOptions
    );

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      token,
      admin,
    });
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = loginAdminSchema.parse(req.body);

    const admin = await prisma.admin.findUnique({
      where: { email: validatedData.email },
    });

    if (!admin) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(validatedData.password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const secret = process.env.JWT_SECRET || 'super-secure-random-jwt-secret-key-change-me';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    const signOptions: SignOptions = {
      expiresIn: expiresIn as unknown as SignOptions['expiresIn'],
    };

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      secret,
      signOptions
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
