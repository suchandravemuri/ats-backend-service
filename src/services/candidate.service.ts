import { Candidate } from "../models/candidate.model";
import {Types} from 'mongoose';

export const getCandidatesByJobId = async (jobId: Types.ObjectId) =>{
  return await Candidate.find({jobId: jobId}).lean()
}