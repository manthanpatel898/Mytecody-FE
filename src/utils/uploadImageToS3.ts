import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const REGION = "ca-central-1";
const S3_BUCKET = "myte-estimation-image";

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: "AKIAZLJWOLIOKJ6AWB73",
    secretAccessKey: "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",
  },
});

export const uploadImageToS3 = async (file: File): Promise<string> => {
  const params:any = {
    Bucket: S3_BUCKET,
    Key: `${Date.now()}-${file.name}`,
    Body: file
    };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${params.Key}`;
  } catch (err) {
    throw err;
  }
};
