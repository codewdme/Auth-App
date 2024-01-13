import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  emailID: {
    type: String,
    required: [true, "please provide a valid email ID"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
  },
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
