import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

export const generateTokenAndSetCookie = (res, userId) => {
  // console.log(userId)
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
  res.cookie("sessionId", token, {
    httpOnly: true,  // can't be accessed via javascript, prevents attack known as //! XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents an attack called //! CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  return token;
}
