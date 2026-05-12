import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
})

export const BUCKET_NAME = process.env.R2_BUCKET_NAME || "events-photos"

/**
 * Generate a presigned URL for uploading a file directly to R2 from the client
 */
export async function getUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })

  // URL expires in 15 minutes
  return await getSignedUrl(r2, command, { expiresIn: 900 })
}

/**
 * Generate a presigned URL for downloading/viewing a file from R2
 */
export async function getDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  // URL expires in 1 hour
  return await getSignedUrl(r2, command, { expiresIn: 3600 })
}
