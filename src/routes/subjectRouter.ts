import express from 'express';
import { createSubject, getSubjects } from '../controllers/subjectController';
const router = express.Router();

router.route('/').get(getSubjects).post(createSubject)
export default router;