import express, { Request, Response, NextFunction } from "express";
// import { userList } from "../controllers/userController";
import Book from "../models/bookModel";
import User from "../models/userModel";
import { getThebook } from "../controllers/bookController";
import { protect, userLoggedin } from "../middleware/protectMiddleware";

const router = express.Router();

router.get("/", userLoggedin, async (req: Request, res: Response, next: NextFunction) => {
    const data = await getThebook();
    const author = await User.findById(req.user)
    const currentPageNumber = parseInt(req.query.page as string) || 1;
    const user = req.user
    res.render("home", {
        data,
        user: req.user,
        author,
        currentPageNumber
    });
});


router.get('/register', (req: Request, res: Response, next: NextFunction) => {
    res.render('register');
});

router.get('/login', (req: Request, res: Response, next: NextFunction) => {
    res.render('login');
});

router.get('/details', (req: Request, res: Response, next: NextFunction) => {
    res.render('');
});




export default router; 