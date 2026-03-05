import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { io } from "@/index";

export const completePurchase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, dropId } = req.body;

    if (!userId || !dropId) {
      throw new AppError(400, "userId and dropId are required");
    }

    const purchase = await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findFirst({
        where: {
          userId,
          dropId,
          isActive: true,
          expiresAt: { gt: new Date() }
        },
        include: {
          drop: true
        }
      });

      if (!reservation) {
        throw new AppError(403, "No active reservation found for this drop");
      }

      if (reservation.expiresAt < new Date()) {
        throw new AppError(410, "Reservation has expired");
      }

      const newPurchase = await tx.purchase.create({
        data: {
          userId,
          dropId,
          price: reservation.drop.price,
          quantity: 1
        },
        include: {
          drop: true,
          user: {
            select: {
              username: true
            }
          }
        }
      });

      await tx.reservation.update({
        where: { id: reservation.id },
        data: { isActive: false }
      });

      return newPurchase;
    });

    const updatedDrop = await prisma.drop.findUnique({
      where: { id: dropId },
      include: {
        purchases: {
          take: 3,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                username: true
              }
            }
          }
        }
      }
    });

    io.emit("PURCHASE_COMPLETED", {
      dropId,
      purchaser: {
        username: purchase.user.username
      },
      availableStock: updatedDrop?.availableStock,
      recentPurchasers: updatedDrop?.purchases.map(p => ({
        username: p.user.username,
        purchasedAt: p.createdAt
      }))
    });

    res.status(201).json({
      success: true,
      data: {
        id: purchase.id,
        drop: {
          name: purchase.drop.name,
          price: purchase.drop.price
        },
        price: purchase.price,
        createdAt: purchase.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
