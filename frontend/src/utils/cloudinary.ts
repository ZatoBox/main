import cloudinary from 'cloudinary';

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function uploadImageFromBase64(
  base64String: string
): Promise<string> {
  if (!base64String.startsWith('data:image/'))
    throw new Error('Invalid base64 format');
  const parts = base64String.split(',');
  if (parts.length < 2) throw new Error('Invalid base64 format');
  const data = Buffer.from(parts[1], 'base64');
  if (data.length > MAX_FILE_SIZE)
    throw new Error('File size exceeds 5MB limit');
  const res = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: 'products' },
      (error: unknown, result: any) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(data);
  });
  return res.secure_url;
}

export async function uploadMultipleImagesFromBase64(
  base64Strings: string[]
): Promise<string[]> {
  const urls: string[] = [];
  for (const s of base64Strings) {
    if (!s) continue;
    const url = await uploadImageFromBase64(s);
    urls.push(url);
  }
  return urls;
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const size = (file as any).size || 0;
  if (size > MAX_FILE_SIZE) throw new Error('File size exceeds 5MB limit');
  const name = (file as any).name || '';
  const lower = name.toLowerCase();
  if (![...ALLOWED_EXTENSIONS].some((ext) => lower.endsWith(ext)))
    throw new Error('Invalid file type. Only jpg, jpeg, png, webp allowed');
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const res = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: 'products' },
      (error: unknown, result: any) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
  return res.secure_url;
}

export async function uploadProfileImage(file: File): Promise<string> {
  const size = (file as any).size || 0;
  if (size > MAX_FILE_SIZE) throw new Error('File size exceeds 5MB limit');
  const name = (file as any).name || '';
  const lower = name.toLowerCase();
  if (![...ALLOWED_EXTENSIONS].some((ext) => lower.endsWith(ext)))
    throw new Error('Invalid file type. Only jpg, jpeg, png, webp allowed');
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const res = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: 'profiles' },
      (error: unknown, result: any) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
  return res.secure_url;
}

export async function uploadMultipleImagesFromFiles(
  files: File[]
): Promise<string[]> {
  const urls: string[] = [];
  for (const f of files) {
    if (!f) continue;
    const url = await uploadImageToCloudinary(f);
    urls.push(url);
  }
  return urls;
}
