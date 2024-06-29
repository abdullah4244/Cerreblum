import express from 'express';
import { getMe, login, signup, verifyToken } from '../controllers/authController';

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login)
router.get('/me',verifyToken,getMe)


export default router;