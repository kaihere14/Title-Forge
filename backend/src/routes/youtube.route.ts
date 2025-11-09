import { Router } from "express";
import { getYoutubeId } from "../controllers/yt.controller";
import verifyJWT from "../middlewares/veirfyJWT";
import verifyCredit from "../middlewares/verifyCredit";




const router = Router();

router.post("/channel-id",verifyJWT, verifyCredit, getYoutubeId);
router.post("/test",verifyJWT, verifyCredit,(req, res) => {
    res.json({ message: "Test route is working!" });
});



export default router;