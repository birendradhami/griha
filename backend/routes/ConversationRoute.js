import express from "express";
import {
  createConversation,
  deleteConversation,
  getConversation,
} from "../controllers/conversationController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/:id", verifyToken, getConversation);

router.post("/create", verifyToken, createConversation);
router.delete("/delete/:chatId",  deleteConversation);

export default router;
