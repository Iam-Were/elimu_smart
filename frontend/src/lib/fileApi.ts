/**
 * File Upload API
 * Manages file uploads to Parse Server
 */

import { getParse } from '@/config/parse';

export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

/**
 * Convert file to base64
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/png;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Upload a file to Parse Server
 */
export async function uploadFile(
  file: File,
  chatRoomId?: string
): Promise<UploadedFile> {
  const Parse = await getParse();

  try {
    // Convert file to base64
    const base64Data = await fileToBase64(file);

    // Upload to Parse Server
    const result = await Parse.Cloud.run('uploadFile', {
      fileName: file.name,
      fileData: base64Data,
      fileType: file.type,
      chatRoomId
    });

    return {
      url: result.url,
      name: result.name || file.name,
      size: result.size || file.size,
      type: result.type || file.type
    };
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
}

/**
 * Upload profile image
 */
export async function uploadProfileImage(file: File): Promise<string> {
  const Parse = await getParse();

  try {
    // Convert file to base64
    const base64Data = await fileToBase64(file);

    // Upload to Parse Server
    const result = await Parse.Cloud.run('uploadProfileImage', {
      fileName: file.name,
      fileData: base64Data,
      fileType: file.type
    });

    return result.url;
  } catch (error) {
    console.error('Failed to upload profile image:', error);
    throw error;
  }
}
