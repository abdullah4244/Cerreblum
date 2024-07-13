import express from 'express';
import { createPage, createSubject, createTopics, getPageById, getPages, getSubjectById, getSubjects, getTopicById, getTopicsBySubject, updatePage } from '../controllers/subjectController';
import upload from '../middlewares/multer';
const router = express.Router();

router.route('/').get(getSubjects).post(upload.single('photo'),createSubject);
router.route('/:id').get(getSubjectById)
router.route('/:id/topic').post(createTopics).get(getTopicsBySubject)
router.get('/:id/topic/:topicId',getTopicById)
router.route('/:id/topic/:topicId/page').post(createPage).get(getPages)
router.route('/:id/topic/:topicId/page/:pageId').patch(updatePage).get(getPageById)
export default router;