import { Router } from "express";
import multer from "multer";
import { addCandidate, getCandidates } from "../controllers/candidatesController";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Route → Controller → Service
router.post("/", upload.single("resume"), addCandidate);

router.get("/", getCandidates);

export default router;
