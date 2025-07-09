import express from 'express';
import { uploadBook, getBooks,deleteBook } from '../controllers/bookController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', getBooks);
router.post('/upload', auth(['admin']), uploadBook);
router.delete('/:id', deleteBook);
export default router;
