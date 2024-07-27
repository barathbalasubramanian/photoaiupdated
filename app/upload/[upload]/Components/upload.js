'use client'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import imageCompression from 'browser-image-compression';
export default async function HandelUploadSubmit(Array,selfie,EventName,name) {
      const options = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 100,
          useWebWorker: true,
      }
      const Compresedimage = await imageCompression(selfie, options);
      const uniqueFileName = new Date().toISOString().replace(/[-:.]/g, "").replace("T", "_");
      const s3Client = new S3Client({
          region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
          credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY
          }
      });
          const uploadParams = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: `${EventName}/selfie/${name.split(' ').join('_')}/image.jpeg`,
            Body: selfie,
            ContentType: 'image/jpeg',
            ACL: 'public-read'
        };
        const uploadJaonParams = {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          Key: `${EventName}/selfie/${name.split(' ').join('_')}/Data.json`,
          Body: JSON.stringify(Array),
          ContentType: 'application/json',
          ACL: 'public-read'
        };
        const selfieData = {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          Key: `${EventName}/Output/${name.split(' ').join('_')}/Data.json`,
          Body: JSON.stringify([]),
          ContentType: 'application/json',
          ACL: 'public-read'
        };
        const response = await s3Client.send(new PutObjectCommand(uploadParams));
        const resp = await s3Client.send(new PutObjectCommand(selfieData));
        const respons = await s3Client.send(new PutObjectCommand(uploadJaonParams));
        if(response.$metadata.httpStatusCode === 200 && respons.$metadata.httpStatusCode === 200 && resp.$metadata.httpStatusCode === 200){return true}
}
