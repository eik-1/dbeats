import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "User" },
  about: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  twitterUsername: { type: String },
  isArtist: { type: Boolean, default: false },
  walletAddress: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", userSchema);

export default User;
