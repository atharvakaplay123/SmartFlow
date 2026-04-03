import express from 'express';
import type { Request, Response } from 'express';
import { getTraffic } from '../services/geminiImageService.js';
import multer from "multer"
const router = express.Router()
router.use(express.json())
const upload = multer();

router.post('/',
    upload.fields([
        { name: "A", maxCount: 1 },
        { name: "B", maxCount: 1 },
        { name: "C", maxCount: 1 },
        { name: "D", maxCount: 1 },
    ]),
    async (req: Request, res: Response) => {
        try {
            const files = req.files as {
                A?: Express.Multer.File[];
                B?: Express.Multer.File[];
                C?: Express.Multer.File[];
                D?: Express.Multer.File[];
            };
            const toBase64 = (file?: Express.Multer.File) => {
                file ? file.buffer.toString("base64") : null
            };
            const base64ImageA = toBase64(files.A?.[0])!;
            const base64ImageB = toBase64(files.B?.[0])!;
            const base64ImageC = toBase64(files.C?.[0])!;
            const base64ImageD = toBase64(files.D?.[0])!;
            const responce = await getTraffic(base64ImageA, base64ImageB, base64ImageC, base64ImageD)
            if (!responce) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                })
            }
            res.status(200).json(responce);
        } catch (e) {
            console.error(e)
            return res.status(500).json({
                message: 'Internal Server Error'
            })
        }
    })

export default router