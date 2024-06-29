import express from 'express';
import { createCategory, deleteCategoryById, getCategories } from '../controllers/categoryController';

const router = express.Router();
router.route('/').get(getCategories).post(createCategory)
router.route('/:id').delete(deleteCategoryById)

export default router;