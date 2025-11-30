import { Router } from "express";
import multer from "multer";
import { addCandidate, getCandidates, evaluate } from "../controllers/candidatesController";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Route → Controller → Service
router.post("/", upload.single("resume"), addCandidate);

router.get("/", getCandidates);

router.post("/evaluate",evaluate)

export default router;
