import Listing from "../models/listing.models.js";
import User from "../models/user.models.js";
import { throwError } from "../utils/error.js";
import bcrypt from "bcrypt";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return throwError(404, "User not found");

    const { password, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Update User
export const updateUser = async (req, res, next) => {
  const { email, username } = req.body;
  if (req.user.id !== req.params.id)
    return next(throwError(401, "User Invalid"));

  const checkEmail = await User.findOne({ email });
  if (checkEmail) return next(throwError(500, "Invalid Information"));

  const checkUserName = await User.findOne({ username });
  if (checkUserName) return next(throwError(500, "Invalid Information"));

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          avatar: req.body.avatar,
          role: req.body.role,
          active: req.body.active,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(throwError(error));
  }
};

// User Delete
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(throwError(401, "User Invalid"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User Deleted Successfully!");
  } catch (error) {
    next(error);
  }
};

// Get User Post
export const userPosts = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(throwError(401, "You can see only your posts"));
  try {
    const posts = await Listing.find({ userRef: req.params.id });
    res.status(200).json(posts);
  } catch (error) {
    next(throwError(404, error.message));
  }
};

// Get Users
export const getUsers = async (req, res, next) => {
  try {
    if (req.user && req.user.role !== 'admin') {
      return next(throwError(401, 'Unauthorized: Only admin can access user list'));
    }

    const users = await User.find().sort({ _id: -1 });
    res.status(200).json({ success: true, result: users });
  } catch (error) {
    next(throwError(500, error.message));
  }
};

// Update User Status
export const updateStatus = (req, res) => {
  const { role, active } = req.body;
  User.findByIdAndUpdate(req.params.id, { role, active })
    .then(() => {
      res.status(200).json({ success: true, result: { _id: req.params.id } });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
};
