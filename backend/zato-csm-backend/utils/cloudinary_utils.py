import cloudinary
import cloudinary.uploader
import os
from fastapi import HTTPException
from typing import List

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024


def upload_image_to_cloudinary(file) -> str:
    if file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 5MB limit")

    filename = file.filename.lower()
    if not any(filename.endswith(ext) for ext in ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only jpg, jpeg, png, webp allowed",
        )

    try:
        result = cloudinary.uploader.upload(file.file, folder="products")
        return result["secure_url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")


def upload_multiple_images(files) -> List[str]:
    urls = []
    for file in files:
        if file:
            url = upload_image_to_cloudinary(file)
            urls.append(url)
    return urls
