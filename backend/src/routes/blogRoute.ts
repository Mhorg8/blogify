import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { blogListController } from "../controllers/blog/blogListController.ts";
import { blogCreateController } from "../controllers/blog/blogCreateController.ts";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/authMiddleware.ts";
import { blogLikeController } from "../controllers/blog/blogLikeController.ts";
import { blogCommentController } from "../controllers/blog/blogCommentController.ts";
import { getBlogDetailController } from "../controllers/blog/blogDetailController.ts";

const router: ExpressRouter = Router();

router.get('/list', optionalAuthMiddleware, blogListController)
router.post('/create', authMiddleware, blogCreateController)
router.post('/like', authMiddleware, blogLikeController)
router.post('/comment', authMiddleware, blogCommentController)
router.get('/:slug', getBlogDetailController)

export default router;