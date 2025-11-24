import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICandidate extends Document {
  _id: Types.ObjectId;
  name: string;
  resumeUrl: string;
  jobId: Types.ObjectId;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    name: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    jobId : {type: Types.ObjectId, required: true}
  },
  {
    timestamps: true
  }
);

export const Candidate = mongoose.model<ICandidate>("Candidate", CandidateSchema);
