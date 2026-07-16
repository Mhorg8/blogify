import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { registerController } from "../controllers/authController.ts";
import { loginController } from "../controllers/loginController.ts";
import { meController } from "../controllers/meController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router: ExpressRouter = Router();

router.post('/register', registerController)
router.post('/login', loginController)
router.get('/me', authMiddleware, meController)

export default router;
