import express from 'express';
import type { Request, Response } from 'express';
import type { vehicleCountD } from '../../types.js';
import { greenTimeLogicD } from '../../services/greenTimeLogic.js';
const router = express.Router()
router.use(express.json())

router.post('/', async (req: Request, res: Response) => {
    try {
        const { D } = req.body as vehicleCountD
        if (!D) {
            return res.status(400).json({ message: `bad request` })
        }
        const greentime = await greenTimeLogicD({ D })
        res.status(200).json(greentime)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }

})

export default router