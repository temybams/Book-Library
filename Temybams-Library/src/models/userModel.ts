import mongoose from 'mongoose'
import Book from './bookModel';
import bcrypt from 'bcrypt'
import joi from 'joi'


// Defining the types of our user model object
interface UserModel extends mongoose.Document {
    AuthorName: string,
    Email: string,
    Password: string,
    matchPassword: (enteredPassword: string) => Promise<boolean>;
    PhoneNumber: string,
    Books: Array<{type: mongoose.Schema.Types.ObjectId; ref: "Book" }>;
}

// Validating user requests using JOI
const userValidation = joi.object({
    AuthorName: joi.string().required(),
    Email: joi.string().email().required(),
    Password: joi.string().required(),
    PhoneNumber: joi.string().required().pattern(/^\d{11}$/)
})

// Defining what our user database would look like using the userModel interface as the type
const userSchema: mongoose.Schema<UserModel> = new mongoose.Schema(
    {
        AuthorName: {type: String, required: true },
        Email: {type: String, required: true, unique: true },
        Password: {type: String, required: true },
        PhoneNumber: {type: String, required: true },
        Books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    },
    {timestamps: true}
)

// Comparing whether encrypted password is using 
userSchema.methods.matchPassword = async function(enteredPassword: string){
    return await bcrypt.compare(enteredPassword, this.Password)
}

//Setting inputed password to encrypted password 
userSchema.pre<UserModel> ("save", async function(next){
    if(!this.isModified("Password")){
        next()
    }
    try{
        const salt = await bcrypt.genSalt(10)
        this.Password = await bcrypt.hash(this.Password, salt)
    }catch(error: any){
        next(error)
    }
});

// Validating the userSchema before saving to the database
userSchema.pre("validate", async function (next){
    try{
    const {AuthorName, Email, Password, PhoneNumber} = this
    const validatedUser = await userValidation.validateAsync(
        {
        AuthorName,
        Email,
        Password,
        PhoneNumber
        },
    {
        abortEarly: false,
    }
    )
    this.set(validatedUser)
    next()
}catch(error: any){
    next(error)
}
});

const User = mongoose.model<UserModel>("User", userSchema)

export default User;
