import { Router } from "express";
import { createDrop, getAllDrops, getDropById } from "@/controllers/drop.controller";

const router = Router();

router.post("/", createDrop);
router.get("/", getAllDrops);
router.get("/:id", getDropById);

export default router;
