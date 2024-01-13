import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg",
    },
    resetToken: { type: String, required: false },
    verified: { type: Boolean, default: false },
    role: {
      type: 'String',
      default: 'basic',
      enum: ['basic', 'admin'],
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};
const User = mongoose.model("User", userSchema);

export default User;
