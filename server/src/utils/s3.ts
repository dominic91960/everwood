import sharp from "sharp";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { generateSubfolderId, generateImageId } from "./nanoid";

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});
const bucketUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/`;

const uploadSimpleProductImages = async (files: Express.Multer.File[]) => {
  const urls = [];
  const subfolderId = generateSubfolderId();

  for (const file of files) {
    const imageId = generateImageId();
    const buffer = await sharp(file.buffer)
      .resize({
        height: 658,
        width: 542,
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .toFormat("png", {
        palette: true,
        effort: 9,
      })
      .toBuffer();
    const key = `products/${subfolderId}/${imageId}.png`;

    const command = new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.mimetype,
    });
    await s3.send(command);
    const url = bucketUrl + key;
    urls.push(url);
  }

  return urls;
};

const updateSimpleProductImages = async (
  originalImageUrls: string[],
  retainedImageUrls: string[],
  uploadFiles: Express.Multer.File[]
) => {
  const newImgUrls = [...retainedImageUrls];
  const subfolderId = originalImageUrls[0].replace(bucketUrl, "").split("/")[1];

  if (originalImageUrls.length !== retainedImageUrls.length) {
    const unusedUrls = originalImageUrls.filter(
      (url) => !retainedImageUrls.includes(url)
    );
    const unusedKeys = unusedUrls.map((url) => ({
      Key: url.replace(bucketUrl, ""),
    }));

    const deleteCmd = new DeleteObjectsCommand({
      Bucket: AWS_BUCKET_NAME,
      Delete: {
        Objects: unusedKeys,
        Quiet: true,
      },
    });
    await s3.send(deleteCmd);
  }

  if (uploadFiles.length > 0) {
    for (const file of uploadFiles) {
      const imageId = generateImageId();
      const buffer = await sharp(file.buffer)
        .resize({
          height: 658,
          width: 542,
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .toFormat("png", {
          palette: true,
          effort: 9,
        })
        .toBuffer();
      const key = `products/${subfolderId}/${imageId}.png`;

      const putCmd = new PutObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.mimetype,
      });
      await s3.send(putCmd);
      const url = bucketUrl + key;

      newImgUrls.push(url);
    }
  }
  return newImgUrls;
};

const uploadVariableProductImages = async (
  subfolder: string,
  superSubfolder: string,
  files: Express.Multer.File[]
) => {
  const urls = [];

  for (const file of files) {
    const imageId = generateImageId();
    const buffer = await sharp(file.buffer)
      .resize({
        height: 658,
        width: 542,
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .toFormat("png", {
        palette: true,
        effort: 9,
      })
      .toBuffer();
    const key = `products/${subfolder}/${superSubfolder}/${imageId}.png`;

    const command = new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.mimetype,
    });
    await s3.send(command);
    const url = bucketUrl + key;
    urls.push(url);
  }

  return urls;
};

const updateVariableProductImages = async (
  subfolderId: string,
  superSubfolderId: string,
  originalImageUrls: string[],
  retainedImageUrls: string[],
  uploadFiles: Express.Multer.File[]
) => {
  const newImgUrls = [...retainedImageUrls];

  if (originalImageUrls.length !== retainedImageUrls.length) {
    const unusedUrls = originalImageUrls.filter(
      (url) => !retainedImageUrls.includes(url)
    );
    const unusedKeys = unusedUrls.map((url) => ({
      Key: url.replace(bucketUrl, ""),
    }));

    const deleteCmd = new DeleteObjectsCommand({
      Bucket: AWS_BUCKET_NAME,
      Delete: {
        Objects: unusedKeys,
        Quiet: true,
      },
    });
    await s3.send(deleteCmd);
  }

  if (uploadFiles.length > 0) {
    for (const file of uploadFiles) {
      const imageId = generateImageId();
      const buffer = await sharp(file.buffer)
        .resize({
          height: 658,
          width: 542,
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .toFormat("png", {
          palette: true,
          effort: 9,
        })
        .toBuffer();
      const key = `products/${subfolderId}/${superSubfolderId}/${imageId}.png`;

      const putCmd = new PutObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.mimetype,
      });
      await s3.send(putCmd);
      const url = bucketUrl + key;

      newImgUrls.push(url);
    }
  }
  return newImgUrls;
};

const deleteProductImages = async (urls: string[]) => {
  for (const url of urls) {
    const key = url.replace(bucketUrl, "");
    const command = new DeleteObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
    });
    await s3.send(command);
  }
};

const changeProfileImage = async (
  prevAvatar: string,
  file: Express.Multer.File
) => {
  const subfolder = generateSubfolderId();
  const imageId = generateImageId();

  let putKey = `users/${subfolder}/${imageId}.png`;
  if (prevAvatar.startsWith(bucketUrl))
    putKey = prevAvatar.replace(bucketUrl, "");

  const buffer = await sharp(file.buffer)
    .resize({
      height: 250,
      width: 250,
      fit: "cover",
    })
    .toFormat("png", {
      palette: true,
      effort: 9,
    })
    .toBuffer();

  const putCommand = new PutObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: putKey,
    Body: buffer,
    ContentType: file.mimetype,
  });
  await s3.send(putCommand);

  const avatar = bucketUrl + putKey;
  return avatar;
};

const deleteProfileImage = async (prevAvatar: string) => {
  if (!prevAvatar.startsWith(bucketUrl)) return;

  const deleteKey = prevAvatar.replace(bucketUrl, "");
  const deleteCommand = new DeleteObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: deleteKey,
  });
  await s3.send(deleteCommand);
};

const changeThumbnailImage = async (
  prevThumbnail: string,
  file: Express.Multer.File
) => {
  const subfolder = generateSubfolderId();
  const imageId = generateImageId();

  let putKey = `blog-post-thumbnails/${subfolder}/${imageId}.png`;
  if (prevThumbnail.startsWith(bucketUrl))
    putKey = prevThumbnail.replace(bucketUrl, "");

  const buffer = await sharp(file.buffer)
    .resize({
      height: 950,
      width: 550,
      fit: "cover",
    })
    .toFormat("png", {
      palette: true,
      effort: 9,
    })
    .toBuffer();

  const putCommand = new PutObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: putKey,
    Body: buffer,
    ContentType: file.mimetype,
  });
  await s3.send(putCommand);

  const thumbnail = bucketUrl + putKey;
  return thumbnail;
};

const deleteThumbnailImage = async (prevAvatar: string) => {
  if (!prevAvatar.startsWith(bucketUrl)) return;

  const deleteKey = prevAvatar.replace(bucketUrl, "");
  const deleteCommand = new DeleteObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: deleteKey,
  });
  await s3.send(deleteCommand);
};

export {
  bucketUrl,
  uploadSimpleProductImages,
  uploadVariableProductImages,
  updateSimpleProductImages,
  updateVariableProductImages,
  deleteProductImages,
  changeProfileImage,
  deleteProfileImage,
  changeThumbnailImage,
  deleteThumbnailImage,
};
