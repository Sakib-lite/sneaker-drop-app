import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email } = req.body;

    if (!username) {
      throw new AppError(400, "Username is required");
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUsername) {
      throw new AppError(409, "Username already exists");
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email }
      });

      if (existingEmail) {
        throw new AppError(409, "Email already exists");
      }
    }

    const user = await prisma.user.create({
      data: {
        username,
        email: email || null
      }
    });

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = Array.isArray(id) ? id[0] : id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            purchases: true,
            reservations: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        purchaseCount: user._count.purchases,
        reservationCount: user._count.reservations,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
