"use client";

import AWS from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { v4 as uuidv4 } from "uuid";

const S3_BUCKET = process.env.VITE_S3_BUCKET;
const REGION = process.env.VITE_S3_REGION;

console.log(S3_BUCKET, REGION);

AWS.config.update({
  accessKeyId: process.env.VITE_S3_API_KEY,
  secretAccessKey: process.env.VITE_S3_API_SECRET,
});
const s3 = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export const uploadFile = async (file: File) => {
  const uniqueFileName = `images/${Date.now()}-${uuidv4()}-${file.name}`;
  if (!S3_BUCKET || !REGION) {
    return null;
  }

  const params: PutObjectRequest = {
    Bucket: S3_BUCKET,
    Key: uniqueFileName,
    Body: file,
  };

  try {
    await s3.putObject(params).promise();

    const fileUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(
      uniqueFileName
    )}`;

    return fileUrl;
  } catch (err) {
    return null;
  }
};

export const uploadFiles = async (files: File[]) => {
  try {
    const fileUrls = await Promise.all(files.map(uploadFile));
    return fileUrls.filter((url) => url) as string[];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to upload files");
  }
};

const extractKeyFromUrl = (url: string) => {
  const urlParts = url.split("/");
  return urlParts.slice(3).join("/");
};
