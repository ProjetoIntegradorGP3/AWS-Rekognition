import express from "express";
import { join } from "path";
const { static: serveStatic } = express;
const app = express();

import aws from "aws-sdk";
import multer, { memoryStorage } from "multer";
const { S3, config } = aws;

import sendImageToS3 from "./upload.cjs"; // Use import statement

import dotenv from "dotenv";
dotenv.config();

// Set up memory storage
const storage = memoryStorage();
const upload = multer({ storage: storage });
app.use(serveStatic("src"));

// Endpoint to serve index.html
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "src", "index.html"));
});

// Endpoint to upload image to S3
app.post("/upload", upload.single("image"), (req, res) => {
  console.log("Recebendo imagem...");
  if (!req.file) {
    res.status(400).send("Selecione uma imagem antes de enviar.");
    return;
  }
  // AWS SDK configuration
  config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  // Create S3 service object
  const s3 = new S3({
    apiVersion: "2006-03-01",
    params: { Bucket: process.env.AWS_BUCKET_NAME }, // ERROR: Doesn't accept slashes.
  });

  // Access the image buffer
  const imageBuffer = req.file.buffer;

  console.log("Sending image to S3...");

  // Send image to S3
  const response = sendImageToS3(s3, imageBuffer);

  if (response) {
    res.status(200).send("Upload realizado com sucesso!");
  } else {
    res.status(400).send("Erro ao realizar upload");
  }
});

// Initialize server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
