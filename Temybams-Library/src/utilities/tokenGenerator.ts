import jwt from 'jsonwebtoken'
import {Response, Request, NextFunction} from 'express'


//Function to generate token for a user on successful sign up or log in
export const tokenGenerator = (res: Response, userId: string) =>{
    const token: string = jwt.sign({userId}, process.env.JWT_SECRET! as string,{
        expiresIn: "3d",
    })
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 100 //cookie header clears in 3 days
    })
    return token
}




