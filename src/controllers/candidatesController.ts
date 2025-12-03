import { Request, Response } from "express";
import { Candidate } from "../models/candidate.model";
import { uploadToS3 } from "../services/s3.service";
import {runnable} from "../langraph-service/ranking-graph"
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

export const evaluate = async(req:Request, res: Response) => {
  try{
    const jobId = req.body.jobId as string;
    const result = await runnable.invoke({
      jobId: jobId
    });

    if (!result.ranked || !Array.isArray(result.ranked)) {
      return res.status(400).json({ error: "No ranked results returned" });
    }
    const updates = result.ranked.map(async (c: any) => {
      return Candidate.findOneAndUpdate(
        { _id: c.id, jobId },
        {
          score: c.score?.toString() || "",
          rank: c.rank,
          reasoning: c.reasoning || "",
        },
        { new: true, upsert: false }
      );
    });

    await Promise.all(updates);

    return res.status(200).json({ success: true, updatedCount: updates.length });
  }
  catch(err){
    return res.status(500).json({ error: JSON.stringify(err) });
  }
}
