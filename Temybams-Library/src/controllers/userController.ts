import { Request, Response, NextFunction } from "express";
import Book from "../models/bookModel";
import { asyncHandler } from '../middleware/asyncHandler';
import User from '../models/userModel'
import { tokenGenerator } from "../utilities/tokenGenerator";


//Function to register a user
export const registerUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        console.log('calling registerUser')
        const { AuthorName, Email, Password, PhoneNumber } = req.body;
        const lowercaseEmail = Email.toLowerCase();
        const userExists = await User.findOne({ Email: lowercaseEmail });
        if (userExists) {
            return res.status(200).json({ message: "User already exists" })
        }
        const user = await User.create({ AuthorName, Email: lowercaseEmail, Password, PhoneNumber })
        // if (user) {
        const token = tokenGenerator(res, user._id);
        return res.redirect('/');
        return res.status(201).json({
            _id: user._id,
            AuthorName: user.AuthorName,
            Email: user.Email,
            PhoneNumber: user.PhoneNumber,
            Books: user.Books,
            token: token
        })
        // }
        res.status(400).json({ message: "Invalid user data" })
    }
)

export const signinUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { Email, Password } = req.body
        const lowercaseEmail = Email.toLowerCase()
        const user = await User.findOne({ Email: lowercaseEmail })
        if (user && (await user.matchPassword(Password))) {
            const token = tokenGenerator(res, user._id)
            // return res.json({
            //     message: 'User signed in successfully',
            // });
            res.redirect('/users/books');
        } else {
            res.status(400).json({ message: "Invalid Email or Password" })
        }
    }
)


export const signoutUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
        // res.status(200).json({ message: "User signed out" });

        res.status(200).redirect('/');
    }
)


export const getAllUsers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const users = await User.find({})
        res.status(200).json(users)
    }
)

export const getUserBooks = asyncHandler(
    async (req, res) => {
        try {
            const userId = req.user;
            const books = await Book.find({ UserId: userId }); // Use UserId instead of userId

            res.render("books", { books });
        } catch (error) {
            console.error("Error fetching books:", error);
            res.status(500).send("Internal Server Error");
        }
    }
)

// export async function userList(){
//     const users = await User.find({})
//     return users
// }