import express, { Request, Response, NextFunction } from 'express';
import Book from '../models/bookModel';
import { addBook, getAllBooks, getBookById, deleteBook, updateBook } from '../controllers/bookController';
import { protect } from '../middleware/protectMiddleware';
const router = express.Router();

/* GET home page. */
router.get('/', protect, addBook);
router.post('/add', protect, addBook);
router.get('/', protect, getAllBooks);
router.get('/:id', protect, getBookById);
router.get('/delete/:id', protect, deleteBook);
router.post('/delete/:id', protect, deleteBook);

router.get('/update/:id', protect, updateBook);
router.post('/update/:id', protect, updateBook)

export default router
