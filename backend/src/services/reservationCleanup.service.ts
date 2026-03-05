import prisma from "@/config/database";
import { io } from "@/index";

export class ReservationCleanupService {
  private static intervalId: NodeJS.Timeout | null = null;

  static start() {
    if (this.intervalId) {
      console.log("Reservation cleanup service is already running");
      return;
    }

    console.log("Starting reservation cleanup service (runs every 10 seconds)");

    this.intervalId = setInterval(async () => {
      try {
        await this.cleanupExpiredReservations();
      } catch (error) {
        console.error("Error in reservation cleanup:", error);
      }
    }, 10000);
  }

  static stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Reservation cleanup service stopped");
    }
  }

  static async cleanupExpiredReservations() {
    const expiredReservations = await prisma.reservation.findMany({
      where: {
        expiresAt: { lt: new Date() },
        isActive: true
      },
      include: {
        drop: true
      }
    });

    if (expiredReservations.length === 0) {
      return;
    }

    console.log(`Found ${expiredReservations.length} expired reservations to clean up`);

    for (const reservation of expiredReservations) {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.reservation.update({
            where: { id: reservation.id },
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
          reason: "RESERVATION_EXPIRED"
        });

        console.log(`Cleaned up expired reservation ${reservation.id} for drop ${reservation.drop.name}`);
      } catch (error) {
        console.error(`Failed to clean up reservation ${reservation.id}:`, error);
      }
    }
  }
}
