import UTIF from 'utif';
import JSZip from 'jszip';

export interface DecodedFileResult {
  dataUrl: string;
  name: string;
  size: string;
  format: string;
}

/**
 * Decodes any user-provided file (TIFF, TIF, ZIP, PNG, JPG, JPEG, WEBP, PDF preview, etc.)
 * into a browser-renderable image Data URL for canvas analysis.
 */
export async function decodeUploadedFile(file: File): Promise<DecodedFileResult> {
  const fileName = file.name;
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

  // Handle ZIP archives
  if (extension === 'zip') {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    const imageFiles = Object.keys(contents.files).filter(name => {
      const ext = name.split('.').pop()?.toLowerCase();
      return ['png', 'jpg', 'jpeg', 'tif', 'tiff', 'webp'].includes(ext || '');
    });

    if (imageFiles.length === 0) {
      throw new Error('No supported image found in ZIP archive.');
    }

    const firstImageName = imageFiles[0];
    const imageBlob = await contents.files[firstImageName].async('blob');
    const subFile = new File([imageBlob], firstImageName);
    return decodeUploadedFile(subFile);
  }

  // Handle TIFF / TIF files
  if (extension === 'tif' || extension === 'tiff') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const ifds = UTIF.decode(buffer);
          if (!ifds || ifds.length === 0) {
            throw new Error('Invalid TIFF structure');
          }

          UTIF.decodeImage(buffer, ifds[0]);
          const rgba = UTIF.toRGBA8(ifds[0]);
          const width = ifds[0].width;
          const height = ifds[0].height;

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          const imgData = ctx.createImageData(width, height);
          
          for (let i = 0; i < rgba.length; i++) {
            imgData.data[i] = rgba[i];
          }
          
          ctx.putImageData(imgData, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');

          resolve({
            dataUrl,
            name: fileName,
            size: sizeFormatted,
            format: 'GeoTIFF / TIFF'
          });
        } catch (err) {
          console.error('TIFF decode error, fallback to URL', err);
          resolve({
            dataUrl: URL.createObjectURL(file),
            name: fileName,
            size: sizeFormatted,
            format: 'TIFF'
          });
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file buffer'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Handle standard images (PNG, JPG, JPEG, WEBP, etc.)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        dataUrl: e.target?.result as string,
        name: fileName,
        size: sizeFormatted,
        format: extension.toUpperCase()
      });
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
