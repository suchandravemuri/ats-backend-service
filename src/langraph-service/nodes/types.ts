// src/graphs/nodes/types.ts

export interface Job {
    id: string;
    description: string;
}

export interface Candidate {
    id: string;
    resumeUrl: string;
    name: string;
}

export interface ExtractedText {
    candidateId: string;
    text: string;
    name: string;
    resumeUrl: string;
}

export interface RankingState {
    jobId: string | null;
    jobDescription: string | null;
    candidates: any[] | null;
    candidateTexts: any[] | null;
    scored: any[] | null;
    reasoned: any[] | null;
    ranked: any[] | null;
  }
  
export interface ScoredCandidate {
    candidateId: string;
    name: string;
    summary: string;
    score: number;
    reason: string;
}
