import { type NextFunction, type Request, type Response } from 'express'
import 'dotenv'
import jwt from 'jsonwebtoken'
const { JsonWebTokenError } = jwt;
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET!)
        if (!payload) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        next();
    } catch (e) {
        if (e instanceof JsonWebTokenError) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        throw e
    }
}