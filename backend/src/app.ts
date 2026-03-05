import express from "express";
import { ENV } from "@/config/env";
import { errorHandler } from "@/middleware/errorHandler";
import { apiLimiter } from "@/middleware/rateLimiter";
import { notFoundHandler } from "@/middleware/notFound";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import { specs } from "@/docs/swagger";
import userRoutes from "@/routes/user.routes";
import dropRoutes from "@/routes/drop.routes";
import reservationRoutes from "@/routes/reservation.routes";
import purchaseRoutes from "@/routes/purchase.routes";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ENV.FRONTEND_URL,
  credentials: true
}));

// Performance middleware
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use("/api", apiLimiter);

// Root route
app.get("/", (_req, res) => {
  res.json({
    message: "🚀 Sneaker Drop API",
    version: "1.0.0",
    docs: `${ENV.SERVER_URL}/api-docs`
  });
});


app.use("/api/users", userRoutes);
app.use("/api/drops", dropRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/purchases", purchaseRoutes);

// Swagger documentation
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: "none",
    filter: true,
  },
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Sneaker Drop API Documentation",
};

app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(specs, swaggerOptions));

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
