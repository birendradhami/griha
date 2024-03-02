import express from "express";
import {
  createNotification,
  getNotification,
  deleteNotification,
} from "../controllers/notificationController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createNotification);
router.get("/:id", verifyToken, getNotification);
router.delete("/delete/:id", deleteNotification);

export default router;
