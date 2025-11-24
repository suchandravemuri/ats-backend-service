import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import candidateRoutes from "./routes/candidate.routes";
import cors from "cors";
import jobRoutes from "./routes/job.routes";
const app = express();
const PORT = 3000;
config()
app.use(cors());
app.use(express.json()); 
app.use("/api/candidates", candidateRoutes);
app.use("/api/jobs", jobRoutes);
app.get("/", (_, res) => {
  res.send("Hello from Express + TypeScript!");
});
const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI)
      const conn = await mongoose.connect(process.env.MONGO_URI!);
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
};
const startServer = async () => {
    await connectDB();
  
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
};
startServer();