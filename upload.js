require("dotenv").config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

 const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: process.env.AWS_BUCKET_NAME }
});

function uploadImage() {
    const fileInput = document.getElementById('imageFile');
    const file = fileInput.files[0];
    if (!file) {
        document.getElementById('status').innerText = 'Selecione uma imagem antes de enviar.';
        return;
    }

    const fileName = file.name;
    const uploadParams = {
        Key: fileName,
        Body: file,
        ContentType: file.type
    };

    s3.upload(uploadParams, function(err, data) {
        if (err) {
            console.log("Erro ao fazer upload", err);
            document.getElementById('status').innerText = 'Erro ao enviar: ' + err.message;
        }
            console.log("Upload bem-sucedido", data);
            document.getElementById('status').innerHTML = 'Upload realizado com sucesso! <a href="' + data.Location + '" target="_blank">Ver imagem</a>';
    });
}