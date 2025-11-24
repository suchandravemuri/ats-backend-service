import { Request, Response } from "express";
import { Candidate } from "../models/candidate.model";
import { uploadToS3 } from "../services/s3.service";
import {Types} from "mongoose"
export const addCandidate = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Resume file is required" });
      }
  
      const { name, jobId } = req.body;
  
      if (!name) {
        return res.status(400).json({ error: "Candidate name is required" });
      }
  
      // Upload file to S3 (handled in the service)
      const resumeUrl = await uploadToS3(req.file);
  
      // Save to database
      const newCandidate = await Candidate.create({
        name,
        resumeUrl,
        jobId
      });
  
      res.json({ message: "Candidate added successfully", newCandidate });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Add candidate failed" });
    }
  };

export const getCandidates = async (_req: Request, res: Response) => {
  try {
    const jobId = _req.query.jobId as string;
    const candidates = await Candidate.find({jobId: new Types.ObjectId(jobId)}).sort({ createdAt: -1 });
    return res.json(candidates);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
