import mongoose from 'mongoose';
import UserModel from '../models/User.model.js';

export const updateProfile = async (req, res) => {
  try {
    const { name, profileImage } = req.body;
    const updateUser = await UserModel.updateOne({ _id: req.userId }, { name, profileImage });
    const user = await UserModel.findOne({ _id: req.userId}).select("-password");
    return res.status(200).json({ success: true, message: "user updated successfully", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
}