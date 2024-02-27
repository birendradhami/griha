import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createPost,
  deletePost,
  updatePost,
  singlePost,
  getListingPost,
  approvePost
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createPost);
router.delete("/delete/:id", deletePost);
router.post("/update/:id", verifyToken, updatePost);
router.get("/:id", singlePost);
router.get("/", getListingPost);
router.put("/approve/:id",verifyToken, approvePost);

export default router;
