function sendImageToS3(s3, file) {
  console.log("Enviando imagem para o S3...");
  if (!file) {
    return;
  }

  const fileName = file.name;
  const uploadParams = {
    Key: fileName,
    Body: file,
    ContentType: file.type,
  };

  s3.upload(uploadParams, function (err, data) {
    if (err) {
      console.log("Erro ao enviar imagem para o S3", err);
      return false;
    }

    console.log("Upload realizado com sucesso!", data.Location);
    return true;
  });
}

module.exports = sendImageToS3;
