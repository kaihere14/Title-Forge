import { Router  } from "express";
const router = Router();

import { verifyNityasha } from "../middlewares/verifyNityasha";
import { nityashaGetYoutubeId } from "../controllers/nityashaController";

router.post("/generate", verifyNityasha, nityashaGetYoutubeId);

export default router;