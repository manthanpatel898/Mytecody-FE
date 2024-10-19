import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Load AWS credentials securely from environment variables
const REGION = "ca-central-1";
const S3_BUCKET = "myte-estimation-image";
console.log(process.env.REACT_APP_AWS_ACCESS_KEY); // Should log your access key
console.log(process.env.REACT_APP_AWS_SECRET_KEY); // Should log your secret key
// Initialize the S3 client with region and credentials from environment variables
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: "AKIAZLJWOLIOKQ4W7FHQ" , // use environment variables
    secretAccessKey: "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",
  },
});

export const uploadImageToS3 = async (file: File): Promise<string> => {
  debugger
  const fileName = `${Date.now()}-${file.name}`; // Generate a unique file name using timestamp
  const params = {
    Bucket: S3_BUCKET,
    Key: fileName, // S3 object key (file name)
    Body: file, // File body (content)
    ContentType: file.type, // Optional: to set the file type
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command); // Upload the file to S3
    // Return the file URL after a successful upload
    return `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;
  } catch (err) {
    console.error("Error uploading to S3:", err); // Log any errors
    throw new Error("Failed to upload image to S3"); // Throw a user-friendly error
  }
};