import { Router  } from "express";
const router = Router();

import { verifyNityasha } from "../middlewares/verifyNityasha.js";
import { nityashaGetYoutubeId } from "../controllers/nityashaController.js";

router.post("/generate", verifyNityasha, nityashaGetYoutubeId);

export default router;