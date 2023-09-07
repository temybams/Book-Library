import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import joi, { number } from "joi";


// Defining the BookModel interface
interface BookModel extends mongoose.Document {
    Title: string,
    datePublished: Date,
    Description: string,
    Summary: string,
    pageCount: number,
    Genre: string,
    bookId: mongoose.Types.ObjectId,
    Publisher: string,
    Image: string,
    UserId: mongoose.Types.ObjectId
}


// Validating Book requests using JOI
const BookValidation = joi.object({
    Title: joi.string().required(),
    datePublished: joi.date().required(),
    Description: joi.string().required(),
    Summary: joi.string().required(),
    pageCount: joi.number().required(),
    Genre: joi.string().required(),
    bookId: joi.any(),
    Publisher: joi.string().required(),
    Image: joi.string().required()
});


// Defining what our Book database would look like using the bookModel interface as the type
const BookSchema: mongoose.Schema<BookModel> = new mongoose.Schema(
    {
        Title: { type: String, required: true },
        datePublished: { type: Date, required: true },
        Description: { type: String, required: true },
        Summary: { type: String, required: true },
        pageCount: { type: Number, required: true },
        Genre: { type: String, required: true },
        bookId: { type: mongoose.Schema.Types.ObjectId },
        Publisher: { type: String, required: true },
        Image: { type: String, required: true },
        UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    },
    { timestamps: true }
);


// Validating the BookSchema before saving to the database
BookSchema.pre("validate", async function (next) {
    try {
        const { Title, datePublished, Description, Summary, pageCount, Genre, bookId, Publisher, Image } = this
        const validatedBook = await BookValidation.validateAsync(
            {
                Title,
                datePublished,
                Description,
                Summary,
                pageCount,
                Genre,
                bookId,
                Publisher,
                Image
            },
            {
                abortEarly: false,
            }
        )
        this.set(validatedBook)
        next()
    } catch (error: any) {
        next(error)
    }
});
// equating the value of book id to mongoose generated _id
BookSchema.pre("save", function (next) {
    if (!this._id) {
        this._id = new mongoose.Types.ObjectId();
    }
    if (!this.bookId) {
        this.bookId = this._id;
    }
    next();
})


const Book = mongoose.model<BookModel>("Book", BookSchema);

export default Book;