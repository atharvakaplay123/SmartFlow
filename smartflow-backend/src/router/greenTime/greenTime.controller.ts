import express from 'express';
import type { Request, Response} from 'express';
import greenTimeABC from './greenTimeABC.js'
import greenTimeD from './greenTimeD.js'
const router = express.Router()
router.use(express.json())

router.use('/ABC',greenTimeABC)
router.use('/D',greenTimeD)

export default router