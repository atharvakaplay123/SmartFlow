import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { admin } from '../../db/models/admin.model.js';
const router = express.Router();
router.use(express.json());
router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'Bad Request'
            });
        }
        await admin.create({ email, password });
        const token = jwt.sign({ email }, process.env.JWT_SECRET);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.send(200).json({ message: 'Signup Successfull' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});
export default router;
//# sourceMappingURL=admin.signup.js.map