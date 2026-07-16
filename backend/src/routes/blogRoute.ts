import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { blogListController } from "../controllers/blog/blogListController.ts";
import { blogCreateController } from "../controllers/blog/blogCreateController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router: ExpressRouter = Router();

router.get('/list', blogListController)
router.post('/create', authMiddleware, blogCreateController)

export default router;