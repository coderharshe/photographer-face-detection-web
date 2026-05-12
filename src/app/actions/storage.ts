'use server'

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'events-photos'

let s3Client: S3Client | null = null;

function getS3Client() {
  if (s3Client) return s3Client;
  
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.warn("Missing Cloudflare R2 credentials. Storage actions will fail.");
    return null;
  }

  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
  return s3Client;
}

export async function getPresignedUrl(key: string) {
  try {
    const client = getS3Client();
    if (!client) return null;

    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })

    // URL expires in 1 hour
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 })
    return signedUrl
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return null
  }
}
