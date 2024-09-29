import jwt from 'jsonwebtoken';
export const verifyToken = async (req, res, next) => {
  try {
  const token = req.cookies.sessionId;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized - no token provided' });
  }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    req.userId = decode.userId;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
}