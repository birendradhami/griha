import Listing from "../models/Listing.js";
import User from "../models/User.js";
import { throwError } from "../utils/error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Get User

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

    const existingUser = await User.findById(req.params.id);

    if (existingUser.email !== email) {
      const checkEmail = await User.findOne({ email });
      if (checkEmail) return next(throwError(500, "Email is already in use"));
    }
    
    if (existingUser.username !== username) {
      const checkUserName = await User.findOne({ username });
      if (checkUserName) return next(throwError(500, "Username is already in use"));
    }

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

// Delete User

export const deleteUser = async (req, res, next) => {
  if (String(req.user.id) !== req.params.id)
    return next(throwError(401, "User Invalid"));

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(throwError(404, "User not found"));
    }

    await Listing.deleteMany({ userRef: user._id });

    await User.deleteOne({ _id: req.params.id });

    res.clearCookie("access_token");

    res.status(200).json("User and associated rooms deleted successfully!");
  } catch (error) {
    next(error);
  }
};


// Get User Room
export const userRooms = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(throwError(401, "You can see only your rooms"));
  try {
    const rooms = await Listing.find({ userRef: req.params.id });
    res.status(200).json(rooms);
  } catch (error) {
    next(throwError(404, error.message));
  }
};

// Get Users
export const getUsers = async (req, res, next) => {
  try {
      const users = await User.find().sort({ _id: -1 });
      res.status(200).json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
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

// get online offline user status
export const getOnlineStatus = async (req, res, next) => {
  try {
    const userID = req.params.id;
    console.log(userID);
    // Fetch user from the database based on userID
    const user = await User.findById(userID);

    if (!user) {
      // Handle the case where the user is not found
      return res.json({ success: false, error: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching online status:", error);
    res.json({ success: false, error: "Failed to fetch online status" });
    next(error);
  }
};
