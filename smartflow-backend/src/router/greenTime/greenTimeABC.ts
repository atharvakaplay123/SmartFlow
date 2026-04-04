import express from 'express';
import type { Request, Response } from 'express';
const router = express.Router()
router.use(express.json())

router.post('/', async (req: Request, res: Response) => {
    try {
        
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }

})

export default router