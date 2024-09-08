import { Router } from "express";
import * as controllers from "../controllers";
import { catchErrors as c } from "../utils";
import authenticate from "../middlewares/authenticate";

const router = Router();

router.post("/register", c(controllers.Register))
router.get("/users/:publicKey", c(controllers.GetProfile))

router.post("/attestations", authenticate, c(controllers.AddAttestation))

export default router;