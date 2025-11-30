import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import pdf from "pdf-parse";

// S3 client (uses IAM role, env creds, or AWS_ACCESS_KEY/SECRET)
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!
    }
});

export async function fetchAndExtractText(s3Url: string): Promise<string> {
    try {
        // Example S3 URL format:
        // https://your-bucket.s3.amazonaws.com/resumes/abc.pdf
        const { bucket, key } = parseS3Url(s3Url);
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        const res = await s3.send(command);

        if (!res.Body) {
            throw new Error("Empty S3 body received");
        }

        // Convert Body to Buffer
        const pdfBuffer = await streamToBuffer(res.Body);
        const header = pdfBuffer.slice(0, 5).toString();
        if (header.startsWith("%PDF")) {
            return "jldbskdbbbbbbhdhbsdf";
            console.log("File detected as PDF → parsing");
            const pdfParse = (pdf as any).default || pdf;
            const data = await pdfParse(pdfBuffer);
            return data.text || "";
        }
        return pdfBuffer.toString("utf-8");
    } catch (err) {
        console.error("Error extracting text:", err);
        return "";
    }
}


function streamToBuffer(stream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on("data", (chunk: any) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
    });
}


function parseS3Url(url: string): { bucket: string; key: string } {


    const pattern1 = /^https:\/\/([^\.]+)\.s3[^\/]*\/(.+)$/;
    const pattern2 = /^https:\/\/s3[^\/]*\/([^\/]+)\/(.+)$/;

    let match = url.match(pattern1);
    if (match) {
        return { bucket: match[1], key: match[2] };
    }

    match = url.match(pattern2);
    if (match) {
        return { bucket: match[1], key: match[2] };
    }

    throw new Error("Invalid S3 URL: " + url);
}
