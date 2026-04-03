import express from 'express';
import vehicleCount from './vehicle.js';
// import vehicleCount from './gemini/imageVehicleCount.js'
import auth from './auth/auth.controller.js';
import admin from './admin/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = express.Router();
router.use(express.json());
router.use('/auth', auth);
router.use('/admin', authMiddleware, admin);
router.use('/vehicle-count', vehicleCount);
export default router;
//# sourceMappingURL=controller.js.map