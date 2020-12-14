import AWS from 'aws-sdk';
import env from 'dotenv';
env.config();

AWS.config.update({
  accessKeyId: `${process.env.ACCESS_KEY}`,
  secretAccessKey: `${process.env.SECRET_KEY}`,
  region: `${process.env.REGION}`
});

const s3: any = new AWS.S3({ params: { Bucket: 'reactive-pos' } });

const upload = (fileName: any, imageBuffer: any, fileType: any, req: any) => {
  return s3.upload({
    Key: Date.now() + fileName,
    Body: imageBuffer,
    ContentEncoding: 'base64',
    ContentType: fileType,
  }, req).promise();
}


export {
  upload
}





