import { Router } from "express";
import { createReservation, getUserReservations, cancelReservation } from "@/controllers/reservation.controller";
import { reservationLimiter } from "@/middleware/rateLimiter";

const router = Router();

router.post("/", reservationLimiter, createReservation);
router.get("/my-reservations", getUserReservations);
router.delete("/:id", cancelReservation);

export default router;
