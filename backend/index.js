import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRouter from "./routes/user.route.js";
import auth from "./routes/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import postRouter from "./routes/post.route.js";
import messageRouter from "./routes/message.route.js";
import conversationRoute from "./routes/conversation.route.js";
import notificatonRoute from "./routes/notification.route.js";
import forgotPasswordRouter from "./routes/forgotPassword.js";
import jwt from "jsonwebtoken";
import User from "./models/user.models.js";

import path from "path";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use(cookieParser());

const expressServer = http.createServer(app);

//Handling CORS origin
if (process.env.NODE_ENV === "local") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      credentials: true,
    })
  );
}

const PORT = process.env.PORT || 3000;

// Connect to the database
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO);
  console.log("Database connected");
}
// Starting the server
expressServer.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", auth);
app.use("/api/posts", postRouter);
app.use("/api/message", messageRouter);
app.use("/api/conversation", conversationRoute);
app.use("/api/notification", notificatonRoute);
app.use("/api/forgotPassword", forgotPasswordRouter);

//============== Deployment==============//

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  const staticFilesPath = path.join(__dirname, "client", "dist");
  app.use(express.static(staticFilesPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticFilesPath, "index.html"));
  });
} else {
}

//============== Deployment==============//
app.get("/", (req, res) => {
  res.send("api listing...");
});
// Handle middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

//----------------------------Handling Socket.io ------------------------------//

// Handling CORS origin
export const io = new Server(expressServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://property-sell.vercel.app",
      "https://property-sell-gjz462ec1-emoncr.vercel.app/",
    ],
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  // console.log(`socket connected with ${socket.id}`);
  const token = socket.handshake.auth.token;
  // console.log(token);
  
  
  async function getUserDataFromRequest(token) {
    try {
      if (token) {
        const userData = await jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded Token:", userData);
        return userData;
      } else {
        // throw new Error("No token");
        console.log("Not found token");
      }
    } catch (error) {
      console.error("Token Verification Error:", error);
      // throw error;
    }
  }

  (async () => {
    try {
      const user_id = await getUserDataFromRequest(token);
      // console.log(user_id.id);
      await User.findByIdAndUpdate(user_id.id, {
        $set: { onlineOffline: "1" },
      });
      //  user broadcast online status
      socket.broadcast.emit("getOnlineUser", {
        userID: user_id.id,
        status: "Online",
        onOff: "1",
        colorA: "text-green-500",
        colorR: "text-gray-500",
        colorAB: "border-green-500",
        colorRB: "border-gray-500",
      });
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  })();

  //=======Messaging Feature Here ======//
  socket.on("join_room", (chatId) => {
    socket.join(chatId);
  });

  socket.on("send_message", (data) => {
    socket.to(data.chatId).emit("receive_message", data);
    socket.broadcast.emit(`${data.to}`, data);
  });

  socket.on("disconnect", (data) => {
    console.log(`user disconnected successfully ${socket.id}`);
    (async () => {
      try {
        const user_id = await getUserDataFromRequest(token);
        console.log(user_id.id);
        await User.findByIdAndUpdate(user_id.id, {
          $set: { onlineOffline: "0" },
        });
        //  user broadcast offline status
      socket.broadcast.emit("getOfflineUser", {
        userID: user_id.id,
        status: "Offline",
        onOff: "1",
        colorA: "text-gray-500",
        colorR: "text-green-500",
        colorAB: "border-gray-500",
        colorRB: "border-green-500",
      });

      } catch (error) {
        // Handle the error if needed
        console.error("Error getting user data:", error);
      }
    })();
  });
});
