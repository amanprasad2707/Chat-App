import express from 'express';
import searchUser from '../controllers/searchUser.controller.js';
const router = express.Router();


router.post('/search-user', searchUser);

export default router;