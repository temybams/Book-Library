import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { asyncHandler } from '../middleware/asyncHandler'
import Book from '../models/bookModel'


export const addBook = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.method === "GET") {
            return res.render("addbook");
        } else if (req.method === "POST") {
            const { Title, datePublished, Description, Summary, pageCount, Genre, bookId, Publisher, Image } = req.body;
            const book = await Book.create({
                Title,
                datePublished,
                Description,
                Summary,
                pageCount,
                Genre,
                bookId,
                Publisher,
                Image,
                UserId: req.user // Assign the UserId here
            });

            const author = await User.findById(req.user);
            if (!author) {
                throw new Error("Author not found");
            }

            // Update the author's Books array with the new book's ID
            author.Books.push(book._id);
            await author.save();

            return res.redirect('/users/books');
        }
    }

);


export const getAllBooks = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const books = await Book.find({});
        res.status(200).json(books);
    });

export const getBookById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const book = await Book.findById(req.params.id);
        if (book) {
            //    return res.status(200).json(book);
            return res.render('details', {
                book
            })
        } res.status(404).json({ message: "Book not found" });
    });

export const deleteBook = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.method === "GET") {
            const updateBook = await Book.findById(req.params.id);
            return res.render('delete', {
                updateBook
            })
        }
        const book = await Book.findById(req.params.id);
        if (book && book.UserId) {
            const bookOwner = book.UserId.toString()
            const loggedinUser = req.user
            if (bookOwner != loggedinUser) {
                return res.status(401).json({ error: "Not authorized to delete book" })
            }
            await book.deleteOne({ _id: req.params.id });
            if (req.method === "GET") {
                return res.render("update");
            } else if (req.method === "POST")
                res.redirect('/users/books')
            return res.json({ message: "Book removed succesfully" });

        } res.status(404).json({ Message: "Book not found" });
    });

export const updateBook = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.method === "GET") {
            const updateBook = await Book.findById(req.params.id);
            return res.render("update", {
                updateBook
            });
        } else if (req.method === "POST") {
            const book = await Book.findById(req.params.id).populate("UserId", "_id");
            if (!book) return res.status(404).json({ message: "Book not found" });


            const bookOwner = book.UserId._id.toString();

            const loggedinUser = req.user
            if (bookOwner != loggedinUser) {
                return res.status(401).json({ error: "Not authorized to update the book" })
            }
            book.Title = req.body.title || book.Title;
            book.datePublished = req.body.datePublished || book.datePublished;
            book.Description = req.body.description || book.Description;
            book.Summary = req.body.Summary || book.Summary;
            book.pageCount = req.body.pageCount || book.pageCount;
            book.Genre = req.body.genre || book.Genre;
            book.Publisher = req.body.publisher || book.Publisher;
            book.Image = req.body.Image || book.Image;
            await book.save();
            return res.redirect('/users/books');
        } res.status(404).json({ message: "Book not found" });

    });


// displays all book in home
export async function getThebook() {
    const books = await Book.find({})
    return books
}




