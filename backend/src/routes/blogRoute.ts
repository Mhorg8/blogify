import { Router } from "express";
import type { Request, Response, Router as ExpressRouter } from "express";

const router: ExpressRouter = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json("blogs");
});

export default router;
