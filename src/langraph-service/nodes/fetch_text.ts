// --- IMPORTS ---
import { getJobById } from "../../services/job.service";
import { getCandidatesByJobId } from '../../services/candidate.service';
import { fetchAndExtractText } from "../../services/utils";
import {Types} from 'mongoose'
// ------------------- NODE FUNCTION -------------------
export async function fetchTextNode(state: any) {
  const jobId = state.jobId;
  
  const job = await getJobById(jobId);
  if (!job) throw new Error("Job not found");

  const candidates = await getCandidatesByJobId(new Types.ObjectId(jobId));
  const mapped = [];
  for (const c of candidates) {
    const text = await fetchAndExtractText(c.resumeUrl);

    mapped.push({
      id: c._id.toString(),
      name: c.name,
      resumeUrl: c.resumeUrl,
      text
    });
  }
  return {
    jobDescription: job.description,
    candidates,
    candidateTexts: mapped
  };
}
