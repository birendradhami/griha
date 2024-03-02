import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createRoom,
  deleteRoom,
  updateRoom,
  singleRoom,
  getListingRoom,
  approveRoom
} from "../controllers/roomController.js";

const router = express.Router();

router.post("/create", verifyToken, createRoom);
router.delete("/delete/:id", deleteRoom);
router.post("/update/:id", verifyToken, updateRoom);
router.get("/:id", singleRoom);
router.get("/", getListingRoom);
router.put("/approve/:id",verifyToken, approveRoom);

export default router;
