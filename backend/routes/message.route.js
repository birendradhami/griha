import express from "express";
import { getMessage, postMessage } from "../controllers/message.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", verifyToken, getMessage);

router.post("/create", verifyToken, postMessage);

export default router;
