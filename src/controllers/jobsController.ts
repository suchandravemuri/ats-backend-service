import { Request, Response } from "express";
import * as jobService from "../services/job.service"
export const addJob = async (req: Request, res: Response) => {
  try {
    console.log("asdasdasdasdasdasd");
    console.log(req.body);
    const { name, description, role } = req.body;

    if (!name || !description || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const job = await jobService.createJob({ name, description, role });
    res.status(201).json({ success: true, job });
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ error: "Failed to create job" });
  }
};

export const getJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await jobService.getAllJobs();
    res.json({ success: true, jobs });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
