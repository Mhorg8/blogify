import { Router } from "express";
import type {Router as ExpressRouter} from "express";
import {getUserController} from "../controllers/user/userContoroller.ts";

const router: ExpressRouter = Router();

router.get('/list' , getUserController)

export default router;