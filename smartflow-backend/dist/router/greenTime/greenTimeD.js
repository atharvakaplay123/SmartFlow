import express from 'express';
const router = express.Router();
router.use(express.json());
router.post('/', async (req, res) => {
    try {
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