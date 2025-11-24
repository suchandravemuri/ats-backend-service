import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  name: string;
  description: string;
  role: string;
}

const JobSchema: Schema<IJob> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    role: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export const Job = mongoose.model<IJob>("Job", JobSchema);
