import cloudinary
import cloudinary.uploader
import os
import base64
from fastapi import HTTPException
from typing import List
from io import BytesIO

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024


def upload_image_from_base64(base64_string: str) -> str:
    if not base64_string.startswith("data:image/"):
        raise HTTPException(status_code=400, detail="Invalid base64 format")

    header, data = base64_string.split(",", 1)
    image_data = base64.b64decode(data)

    if len(image_data) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 5MB limit")

    file_obj = BytesIO(image_data)
    file_obj.seek(0)

    result = cloudinary.uploader.upload(file_obj, folder="products")
    return result["secure_url"]


def upload_multiple_images_from_base64(base64_strings: List[str]) -> List[str]:
    urls = []
    for base64_str in base64_strings:
        if base64_str:
            url = upload_image_from_base64(base64_str)
            urls.append(url)
    return urls


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


def upload_profile_image(file) -> str:
    if file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 5MB limit")

    filename = file.filename.lower()
    if not any(filename.endswith(ext) for ext in ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only jpg, jpeg, png, webp allowed",
        )

    try:
        result = cloudinary.uploader.upload(file.file, folder="profiles")
        return result["secure_url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")
