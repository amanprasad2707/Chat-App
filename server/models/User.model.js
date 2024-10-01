import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: [true, 'user with this email already exists'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
  profileImage: {
    type: String,
    default: '',
  }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;