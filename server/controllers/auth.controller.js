import bcryptjs from 'bcryptjs';
import UserModel from "../models/User.model.js";
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';

const signup = async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "all fields are required" })
    const userAlreadyExists = await UserModel.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ message: "User with this email already exists", success: false });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name, email, password: hashPassword, profileImage
    }

    const user = await new UserModel(payload);
    await user.save();
    generateTokenAndSetCookie(res, user._id);
    return res.status(201).json({ success: true, message: "user created successfully", user: { ...user._doc, password: undefined } })
  } catch (error) {
    res.status(500).json({ message: error.message || error, success: false });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const user = await UserModel.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Please enter a valid password" });
    }

    generateTokenAndSetCookie(res, user._id);
    return res.status(200).json({
      success: true, message: "User logged in successfully", userData: { ...user._doc, password: undefined }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "something went wrong" });
  }
}

const logout = async(req, res) => {
  try {
    res.clearCookie("sessionId");
    return res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({success: false, message: error.message || "Something went wrong"});
  }
}

const checkAuth = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, message: "User is authenticated", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'something went wrong' });
  }
}

export {
  signup,
  login,
  checkAuth,
  logout,
}