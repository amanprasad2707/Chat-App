import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser'
import connectDB from "./config/MongoDB.js";
import authRoutes from "./routes/auth.route.js";
import searchUser from './routes/index.js';
import { app, server } from './socket/index.js';

// const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))
configDotenv();
const port = process.env.PORT || 3000;

connectDB();
app.get('/', (req, res) => {
  res.json({ success: true, message: "Hello, world!" });
})

app.use('/api', authRoutes);
app.use('/api', searchUser);


server.listen(port, () => {
  console.log(`Server is listening on ${port}`);
})