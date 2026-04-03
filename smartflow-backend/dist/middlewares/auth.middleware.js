import {} from 'express';
import 'dotenv';
import jwt from 'jsonwebtoken';
const { JsonWebTokenError } = jwt;
export async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        next();
    }
    catch (e) {
        if (e instanceof JsonWebTokenError) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        throw e;
    }
}
//# sourceMappingURL=auth.middleware.js.map