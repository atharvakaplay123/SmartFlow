import express from 'express';
import 'dotenv/config';
import { admin } from '../../db/models/admin.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
        const user = await admin.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'User Not Found'
            });
        }
        const isUserVerified = await bcrypt.compare(password, user.password);
        if (!isUserVerified) {
            return res.status(401).json({
                message: 'Email or Password is Incorrect'
            });
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.send(200).json({ message: 'Login Successfull' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});
export default router;
//# sourceMappingURL=admin.login.js.map