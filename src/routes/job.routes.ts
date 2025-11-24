import { Router } from "express";
import { addJob, getJobs } from "../controllers/jobsController";

const router = Router();

// Add a job
router.post("/", addJob);

// Get all jobs
router.get("/", getJobs);

export default router;
