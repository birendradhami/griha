import express from "express";
import {
  deleteUser,
  updateUser,
  getUser,
  userPosts,
  getUsers,
  updateStatus,
  getOnlineStatus,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import checkAccess from "../middleware/checkAccess.js";

const router = express.Router();

router.get("/:id", getUser);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/posts/:id", verifyToken, userPosts);
router.get("/", getUsers);
router.patch("/updateStatus/:id", updateStatus);

router.get("/getOnlineStatus/:id", getOnlineStatus);
 
export default router;
