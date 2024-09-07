import { Router } from "express";
import * as controllers from "../controllers";
import { catchErrors as c } from "../utils";

const router = Router();

router.post("/register", c(controllers.Register))

export default router;