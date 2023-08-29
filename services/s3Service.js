const AWS = require("aws-sdk");

/**
 * Configures AWS SDK with access credentials and region.
 */

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

const s3 = new AWS.S3();

/**
 * Uploads a file to Amazon S3 bucket.
 * @param {string} fileName - The name to be used for the uploaded file in S3.
 * @param {Buffer} fileData - The data of the file to be uploaded.
 * @returns {Promise<object>} - A promise that resolves with S3 upload response.
 * @throws {Error} - If there is an error during the upload process.
 */

const uploadFileToS3 = async (fileName, fileData) => {
  try {
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileData,
    };
    return s3.upload(s3Params).promise();
  } catch (error) {
    throw new Error("Error uploading s3");
  }
};

module.exports = uploadFileToS3;
