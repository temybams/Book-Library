import express from 'express';
import { registerUser, signinUser, signoutUser, getAllUsers, getUserBooks} from '../controllers/userController';
import Book from '../models/bookModel';
import { protect } from '../middleware/protectMiddleware';
const router = express.Router();

/* GET users listing. */
//router.post("/", registerUser);
router.post("/register", registerUser)
router.post("/login", signinUser)
router.post("/logout", protect, signoutUser)
router.get("/getall", protect, getAllUsers)
router.get("/books", protect, getUserBooks);


export default router

