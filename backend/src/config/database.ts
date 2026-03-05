import { PrismaClient } from "@prisma/client";
import { ENV } from "@/config/env";

const prisma = new PrismaClient({
  log: ENV.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  datasources: {
    db: {
      url: ENV.DATABASE_URL,
    },
  },
});

const handleShutdown = async () => {
  console.log("Shutting down database connection");
  await prisma.$disconnect();
};

process.on("SIGTERM", handleShutdown);
process.on("SIGINT", handleShutdown);

export default prisma;
