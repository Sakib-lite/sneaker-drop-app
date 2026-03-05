import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "@/app";
import { ENV } from "@/config/env";
import prisma from "@/config/database";
import { ReservationCleanupService } from "@/services/reservationCleanup.service";

const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ENV.FRONTEND_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

export { io };

httpServer.listen(ENV.PORT, () => {
  console.log(`🚀 Server running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`);
  console.log(`📚 API Documentation: ${ENV.SERVER_URL}/api-docs`);

  ReservationCleanupService.start();
  console.log(`🧹 Reservation cleanup service started`);
});

const shutdown = async () => {
  console.log("Shutdown signal received");

  ReservationCleanupService.stop();

  io.close(() => {
    console.log("Socket.IO connections closed");
  });

  httpServer.close(async () => {
    console.log("HTTP server closed");

    try {
      await prisma.$disconnect();
      console.log("Database connections closed");
      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 30000);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export default httpServer;
