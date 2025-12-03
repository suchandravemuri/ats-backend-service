import AWS from "aws-sdk";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
config()
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_KEY!,
  region: process.env.AWS_REGION!
});

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_KEY!
    }
  });
  export const uploadToS3 = async (file: Express.Multer.File) => {
    const fileName = `resumes/${Date.now()}-${file.originalname}`;
  
    const params = {
      Bucket: process.env.AWS_BUCKET!,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype
    };
  
    await s3.send(new PutObjectCommand(params));
  
    return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  };
