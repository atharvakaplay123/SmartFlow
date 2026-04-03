import express from 'express';
import adminLogin from './admin.login.js';
import adminSignup from './admin.signup.js';
const router = express.Router();
router.use(express.json());
router.use('/admin-login', adminLogin);
router.use('/admin-signup', adminSignup);
export default router;
//# sourceMappingURL=auth.controller.js.map