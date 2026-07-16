import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { blogListController } from "../controllers/blog/blogListController.ts";

const router: ExpressRouter = Router();

router.get('/list', blogListController)

export default router;