import UTIF from 'utif';
import JSZip from 'jszip';

export interface DecodedFileResult {
  dataUrl: string;
  name: string;
  size: string;
  format: string;
}

/**
 * Decodes any user-provided file (GeoTIFF, TIFF, TIF, ZIP, PNG, JPG, JPEG, WEBP, etc.)
 * into a high-visibility, browser-renderable image Data URL with automatic contrast stretching
 * for satellite bands.
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

  // Handle TIFF / GeoTIFF / TIF files
  if (extension === 'tif' || extension === 'tiff') {
    return new Promise((resolve) => {
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

          // Find min & max across RGB for satellite auto-contrast stretching
          let minVal = 255;
          let maxVal = 0;
          for (let i = 0; i < rgba.length; i += 4) {
            const r = rgba[i];
            const g = rgba[i + 1];
            const b = rgba[i + 2];
            const maxRGB = Math.max(r, g, b);
            const minRGB = Math.min(r, g, b);
            if (maxRGB > maxVal) maxVal = maxRGB;
            if (minRGB < minVal) minVal = minRGB;
          }

          // If raw values are dark (common in Sentinel-2 / 16-bit GeoTIFFs), stretch range
          const needsStretch = maxVal < 100 && maxVal > minVal;
          const range = maxVal - minVal || 1;

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          const imgData = ctx.createImageData(width, height);

          for (let i = 0; i < rgba.length; i += 4) {
            if (needsStretch) {
              imgData.data[i] = Math.min(255, Math.max(0, Math.round(((rgba[i] - minVal) / range) * 255)));
              imgData.data[i + 1] = Math.min(255, Math.max(0, Math.round(((rgba[i + 1] - minVal) / range) * 255)));
              imgData.data[i + 2] = Math.min(255, Math.max(0, Math.round(((rgba[i + 2] - minVal) / range) * 255)));
            } else {
              imgData.data[i] = rgba[i];
              imgData.data[i + 1] = rgba[i + 1];
              imgData.data[i + 2] = rgba[i + 2];
            }
            imgData.data[i + 3] = 255; // Ensure opaque
          }

          ctx.putImageData(imgData, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');

          resolve({
            dataUrl,
            name: fileName,
            size: sizeFormatted,
            format: 'Sentinel GeoTIFF'
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
      reader.onerror = () => {
        resolve({
          dataUrl: URL.createObjectURL(file),
          name: fileName,
          size: sizeFormatted,
          format: 'TIFF'
        });
      };
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
