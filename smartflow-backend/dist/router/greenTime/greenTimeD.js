import express from 'express';
import { greenTimeLogicD } from '../../services/greenTimeLogic.js';
const router = express.Router();
router.use(express.json());
router.post('/', async (req, res) => {
    try {
        const { D } = req.body;
        if (!D) {
            return res.status(400).json({ message: `bad request` });
        }
        const greentime = await greenTimeLogicD({ D });
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
//# sourceMappingURL=greenTimeD.js.map