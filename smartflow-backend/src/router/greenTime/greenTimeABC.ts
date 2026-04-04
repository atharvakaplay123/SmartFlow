import express from 'express';
import type { Request, Response } from 'express';
import type { vehicleCountABC } from '../../types.js';
import { greenTimeLogicABC } from '../../services/greenTimeLogic.js';
const router = express.Router()
router.use(express.json())

router.post('/', async (req: Request, res: Response) => {
    try {
        const { A, B, C } = req.body as vehicleCountABC
        if (!A || !B || !C) {
            return res.status(400).json({ message: `bad request` })
        }
        const greentime = await greenTimeLogicABC({ A, B, C })
        res.status(200).json(greentime)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }

})

export default router