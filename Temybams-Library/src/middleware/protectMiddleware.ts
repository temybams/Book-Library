import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler";

export const protect = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let token;
    // if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    //     token = req.headers.authorization.split(" ")
    // }
    token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
                userId: string;
            };
            req.user = decoded.userId
            console.log(res.locals)
            next();
        } catch (error: any) {
            return res.status(401).json({
                message: "Invalid token, Not authorized",
                Error: error.message,
            });
        }
    } else {
        return res.status(401).json({ message: "No token, Not authorized" })

    }
})


export const userLoggedin = async (req: Request, res: Response, next: NextFunction) => {
    let token
    token = req.cookies.jwt
    if (token) {
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
                    userId: string
                }
                req.user = decoded.userId
                return next()
            }
        } catch (error) {
            return next(error)
        }
    } else {
        next()
    }


}