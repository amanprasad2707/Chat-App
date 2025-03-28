import express from 'express';
import  { checkAuth, login, logout, signup } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { updateProfile } from '../controllers/updateProfile.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/check-auth', verifyToken, checkAuth);
router.post('/update-profile',verifyToken, updateProfile );

export default router;