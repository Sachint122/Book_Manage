import express from 'express';
import { addReview, getReviewsByBook } from '../controllers/reviewController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/add', auth(['user']), addReview);
router.get('/book/:bookId', getReviewsByBook);
export default router;
