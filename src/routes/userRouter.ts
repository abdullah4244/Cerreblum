import express from 'express';
import { createSubscription, getDashboardAnalytics, getMe, getPlans, login, signup, verifyToken } from '../controllers/authController';

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login)
router.get('/me',verifyToken,getMe)
router.get('/analytics',getDashboardAnalytics)
router.get('/get-plans',getPlans)
router.get('/subscription/:priceId',verifyToken,createSubscription)


export default router;