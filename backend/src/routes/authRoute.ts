import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { registerController } from "../controllers/authController.ts";
import { loginController } from "../controllers/loginController.ts";

const router: ExpressRouter = Router();

router.post('/register', registerController)
router.post('/login', loginController)

export default router;
