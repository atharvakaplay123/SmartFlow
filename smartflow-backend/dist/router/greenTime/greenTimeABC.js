import express from 'express';
import { greenTimeLogicABC } from '../../services/greenTimeLogic.js';
const router = express.Router();
router.use(express.json());
router.post('/', async (req, res) => {
    try {
        const { A, B, C } = req.body;
        if (!A || !B || !C) {
            return res.status(400).json({ message: `bad request` });
        }
        const greentime = await greenTimeLogicABC({ A, B, C });
        res.status(200).json(greentime);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});
export default router;
//# sourceMappingURL=greenTimeABC.js.map