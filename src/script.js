function verifyImageInput() {
  const fileInput = document.getElementById("imageFile");
  const file = fileInput.files[0];
  if (!file) {
    document.getElementById("status").innerText =
      "Selecione uma imagem antes de enviar.";
    return false;
  }
  return true;
}

function uploadImage() {
  if (!verifyImageInput()) return;

  // If image is selected, send it to S3
  const fileInput = document.getElementById("imageFile");
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("image", file);
  const history = JSON.parse(localStorage.getItem('uploadHistory')) || [];
  const newItem = {
      name: file.name,
      date: new Date().toLocaleString()
  };
  history.push(newItem);
  localStorage.setItem('uploadHistory', JSON.stringify(history));
  location.reload();

  console.log("Sending image to server...");

  // Send image to server
  fetch("/upload", {
    method: "POST",
    body: formData,
    headers: {
      Accept: "multipart/form-data",
    },
  });
}

function dropHandler(ev) {
  console.log("File(s) dropped");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        console.log(`… file[${i}].name = ${file.name}`);
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => {
      console.log(`… file[${i}].name = ${file.name}`);
    });
  }
}

function dragOverHandler(ev) {
  console.log("File(s) in drop zone");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}
