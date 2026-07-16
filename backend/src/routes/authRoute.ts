import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { registerController } from "../controllers/auth/authController.ts";
import { loginController } from "../controllers/auth/loginController.ts";
import { meController } from "../controllers/auth/meController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { logoutController } from "../controllers/auth/logoutController.ts";

const router: ExpressRouter = Router();

router.post('/register', registerController)
router.post('/login', loginController)
router.get('/me', authMiddleware, meController)
router.post('/logout', logoutController)

export default router;
