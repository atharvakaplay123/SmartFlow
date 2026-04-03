import express from 'express';
import type { Request, Response } from 'express';
const router = express.Router()
router.use(express.json())
router.post('/', async (req: Request, res: Response) => {

})
export default router