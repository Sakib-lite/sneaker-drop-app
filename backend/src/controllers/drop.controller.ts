import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { io } from "@/index";

export const createDrop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, totalStock, imageUrl, startTime } = req.body;

    if (!name || !price || !totalStock) {
      throw new AppError(400, "Name, price, and totalStock are required");
    }

    if (totalStock <= 0) {
      throw new AppError(400, "Total stock must be greater than 0");
    }

    const drop = await prisma.drop.create({
      data: {
        name,
        description,
        price,
        totalStock,
        availableStock: totalStock,
        imageUrl,
        startTime: startTime ? new Date(startTime) : new Date()
      }
    });

    io.emit("NEW_DROP", {
      drop: {
        id: drop.id,
        name: drop.name,
        description: drop.description,
        price: drop.price,
        totalStock: drop.totalStock,
        availableStock: drop.availableStock,
        imageUrl: drop.imageUrl,
        startTime: drop.startTime,
        createdAt: drop.createdAt,
        recentPurchasers: []
      }
    });

    res.status(201).json({
      success: true,
      data: drop
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDrops = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const drops = await prisma.drop.findMany({
      orderBy: {
        createdAt: 'desc'
      },
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

    const dropsWithPurchasers = drops.map(drop => ({
      id: drop.id,
      name: drop.name,
      description: drop.description,
      price: drop.price,
      totalStock: drop.totalStock,
      availableStock: drop.availableStock,
      imageUrl: drop.imageUrl,
      startTime: drop.startTime,
      createdAt: drop.createdAt,
      recentPurchasers: drop.purchases.map(p => ({
        username: p.user.username,
        purchasedAt: p.createdAt
      }))
    }));

    res.json({
      success: true,
      data: dropsWithPurchasers
    });
  } catch (error) {
    next(error);
  }
};

export const getDropById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const drop = await prisma.drop.findUnique({
      where: { id },
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

    if (!drop) {
      throw new AppError(404, "Drop not found");
    }

      res.json({
      success: true,
      data: {
        id: drop.id,
        name: drop.name,
        description: drop.description,
        price: drop.price,
        totalStock: drop.totalStock,
        availableStock: drop.availableStock,
        imageUrl: drop.imageUrl,
        startTime: drop.startTime,
        createdAt: drop.createdAt,
        recentPurchasers: drop.purchases.map(p => ({
          username: p.user.username,
          purchasedAt: p.createdAt
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
