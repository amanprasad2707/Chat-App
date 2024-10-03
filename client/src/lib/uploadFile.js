const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chat-app");

  const response = await fetch(url, {
    body: formData,
    method: 'POST',
  })
  const data = await response.json();
  return data;
}

export default uploadFile;
