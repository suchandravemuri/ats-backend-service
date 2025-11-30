import { Job } from "../models/job.model";
import {Types} from 'mongoose';

export const createJob = async (jobData: {
  name: string;
  description: string;
  role: string;
}) => {
  const job = new Job(jobData);
  return await job.save();
};

export const getAllJobs = async () => {
  return await Job.find().sort({ createdAt: -1 });
};

export const getJobById = async (jobId: Types.ObjectId) =>{
  return await Job.findOne({_id: jobId})
}