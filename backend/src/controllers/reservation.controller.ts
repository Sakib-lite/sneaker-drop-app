import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { ENV } from "@/config/env";
import { io } from "@/index";

export const createReservation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, dropId } = req.body;

    if (!userId || !dropId) {
      throw new AppError(400, "userId and dropId are required");
    }

    const reservation = await prisma.$transaction(async (tx) => {
      const existingReservation = await tx.reservation.findFirst({
        where: {
          userId,
          dropId,
          isActive: true,
          expiresAt: { gt: new Date() }
        }
      });

      if (existingReservation) {
        throw new AppError(409, "You already have an active reservation for this drop");
      }

      const updateResult = await tx.drop.updateMany({
        where: {
          id: dropId,
          availableStock: { gt: 0 }
        },
        data: {
          availableStock: { decrement: 1 }
        }
      });

      if (updateResult.count === 0) {
        throw new AppError(410, "Out of stock");
      }

      const expiresAt = new Date(Date.now() + ENV.RESERVATION_TIMEOUT_SECONDS * 1000);

      const newReservation = await tx.reservation.create({
        data: {
          userId,
          dropId,
          expiresAt,
          isActive: true
        },
        include: {
          drop: true
        }
      });

      return newReservation;
    });

    const updatedDrop = await prisma.drop.findUnique({
      where: { id: dropId }
    });

    io.emit("STOCK_UPDATE", {
      dropId,
      availableStock: updatedDrop?.availableStock
    });

    res.status(201).json({
      success: true,
      data: {
        id: reservation.id,
        dropId: reservation.dropId,
        expiresAt: reservation.expiresAt,
        drop: {
          name: reservation.drop.name,
          price: reservation.drop.price,
          availableStock: reservation.drop.availableStock
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserReservations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      throw new AppError(400, "userId query parameter is required");
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        userId: userId as string,
        isActive: true,
        expiresAt: { gt: new Date() }
      },
      include: {
        drop: {
          select: {
            name: true,
            price: true,
            imageUrl: true,
            availableStock: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const reservationsWithTimeRemaining = reservations.map(r => ({
      id: r.id,
      drop: r.drop,
      expiresAt: r.expiresAt,
      timeRemaining: Math.max(0, Math.floor((r.expiresAt.getTime() - Date.now()) / 1000))
    }));

    res.json({
      success: true,
      data: reservationsWithTimeRemaining
    });
  } catch (error) {
    next(error);
  }
};

export const cancelReservation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const reservationId = Array.isArray(id) ? id[0] : id;
    const { userId } = req.body;

    if (!userId) {
      throw new AppError(400, "userId is required");
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId }
    });

    if (!reservation) {
      throw new AppError(404, "Reservation not found");
    }

    if (reservation.userId !== userId) {
      throw new AppError(403, "Not authorized to cancel this reservation");
    }

    if (!reservation.isActive) {
      throw new AppError(400, "Reservation is already inactive");
    }

    await prisma.$transaction(async (tx) => {
      await tx.reservation.update({
        where: { id: reservationId },
        data: { isActive: false }
      });

      await tx.drop.update({
        where: { id: reservation.dropId },
        data: {
          availableStock: { increment: 1 }
        }
      });
    });

    const updatedDrop = await prisma.drop.findUnique({
      where: { id: reservation.dropId }
    });

    io.emit("STOCK_UPDATE", {
      dropId: reservation.dropId,
      availableStock: updatedDrop?.availableStock,
      reason: "RESERVATION_CANCELLED"
    });

    res.json({
      success: true,
      message: "Reservation cancelled successfully"
    });
  } catch (error) {
    next(error);
  }
};
