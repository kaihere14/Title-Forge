import { Router } from "express";
import { getYoutubeId } from "../controllers/yt.controller.js";
import verifyJWT from "../middlewares/veirfyJWT.js";
import verifyCredit from "../middlewares/verifyCredit.js";


const router = Router();

router.post("/channel-id",verifyJWT, verifyCredit, getYoutubeId);
router.post("/test",verifyJWT, verifyCredit,(req, res) => {
    res.json({ message: "Test route is working!" });
});


export default router;