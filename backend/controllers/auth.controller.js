import bcrypt from "bcrypt";
import * as crypto from "crypto";
import User from "../models/user.models.js";
import { throwError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { passwordGenarator, usernameGenarator } from "../utils/helper.js";
// import User from '../models/User';
import Token from "../models/token.js";
import sendEmail from "../utils/sendEmail.js";

// Handle Signup

export const signupVerify = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).json({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await User.findOneAndUpdate(
      { _id: user._id }, 
      { $set: { verified: true } } // Update the 'verified' field
    );

    await Token.deleteMany({ userId: user._id });

    res.status(200).send({
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const singup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    const token = await new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const verificationUrl = `${process.env.NODE_ENV}users/${newUser.id}/verify/${token.token}`;
    await sendEmail(newUser.email, "Verify Email", verificationUrl);
    res.status(201).json({
      success: true,
      message: "User created successfully. Verification email sent.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Handle Signin

export const signin = async (req, res, next) => {
  const { email, userPassword } = req.body;
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) return next(throwError(404, "Wrong Credentials!"));

    if (!validUser.active) {
      return res.status(400).json({
        success: false,
        message: "Your account has been suspended",
      });
    }

    const isValidPassword = bcrypt.compareSync(
      userPassword,
      validUser.password
    );

    if (!isValidPassword) return next(throwError(401, "Wrong Credentials!"));

    if (!validUser.verified) {
      let token = await Token.findOne({ userId: validUser._id });

      if (!token) {
        token = await new Token({
          userId: validUser._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.NODE_ENV}users/${validUser.id}/verify/${token.token}`;
        await sendEmail(validUser.email, "Verify Email", url);
      }

      return res.status(400).send({
        success: false,
        message: "An Email sent to your account. Please verify.",
      });
    }

    const { password, role, ...rest } = validUser._doc;
    const token = jwt.sign(
      { id: validUser._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "720h" }
    );
    res
      .cookie("access_token", tooken, { httpOnly: false, secure: false })
      .status(200)
      .json(rest);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Handle Google Signin

export const googleSignIn = async (req, res, next) => {
  const { email, name, photo } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      if (!user.active) {
        return res.status(400).json({
          success: false,
          message: "Your account has been suspended",
        });
      }

      const { pass: password, role, ...rest } = savedUser._doc;
      const token = jwt.sign(
        { id: savedUser._id, role },
        process.env.JWT_SECRET,
        { expiresIn: "720h" }
      );

      res
        .cookie("access_token", token, { httpOnly: false, secure: false })
        .status(200)
        .json(rest);
    } else {
      const hashedPassword = bcrypt.hashSync(passwordGenarator(), 10);
      const newUser = new User({
        name,
        username: usernameGenarator(name),
        email,
        password: hashedPassword,
        avatar: photo,
        role: "basic",
      });

      const savedUser = await newUser.save();

      if (!savedUser.active) {
        return res.status(400).json({
          success: false,
          message: "Your account has been suspended",
        });
      }

      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
        expiresIn: "720h",
      });

      const { pass: password, ...rest } = savedUser._doc;
      res
        .cookie("access_token", tooken, { httpOnly: false, secure: false })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(throwError(error));
  }
};

// Handle Signout

export const signOut = async (req, res, next) => {
  try {
    if (req.cookies.access_token) {
      res.clearCookie("access_token");
      res.status(200).json("User Signed Out Successfully!");
    } else {
      res.status(200).json("User Not Signed In");
    }
  } catch (error) {
    next(error);
  }
};
