import * as GeoTIFF from 'geotiff';
import UTIF from 'utif';
import JSZip from 'jszip';

export interface DecodedFileResult {
  dataUrl: string;
  name: string;
  size: string;
  format: string;
}

/**
 * Robust satellite imagery and GeoTIFF decoder using GeoTIFF.js + UTIF + Canvas.
 * Handles Sentinel-2, Landsat, 16-bit multi-band GeoTIFFs, JPEG/PNG/WEBP photos, and ZIP archives.
 */
export async function decodeUploadedFile(file: File): Promise<DecodedFileResult> {
  const fileName = file.name;
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

  // 1. Handle ZIP archives
  if (extension === 'zip') {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    const imageFiles = Object.keys(contents.files).filter(name => {
      const ext = name.split('.').pop()?.toLowerCase();
      return ['png', 'jpg', 'jpeg', 'tif', 'tiff', 'webp'].includes(ext || '');
    });

    if (imageFiles.length === 0) {
      throw new Error('No supported satellite image found in ZIP archive.');
    }

    const firstImageName = imageFiles[0];
    const imageBlob = await contents.files[firstImageName].async('blob');
    const subFile = new File([imageBlob], firstImageName);
    return decodeUploadedFile(subFile);
  }

  // 2. Handle TIFF / GeoTIFF / TIF files with GeoTIFF.js
  if (extension === 'tif' || extension === 'tiff') {
    const arrayBuffer = await file.arrayBuffer();

    // Primary: Decode using GeoTIFF.js (supports 16-bit, float, Sentinel-2, multi-band)
    try {
      const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
      const image = await tiff.getImage();
      const width = image.getWidth();
      const height = image.getHeight();
      const rasters = await image.readRasters();

      // Create thumbnail canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;

      // Determine number of bands
      const numBands = Array.isArray(rasters) ? rasters.length : 1;
      const bandR = Array.isArray(rasters) && numBands >= 1 ? rasters[0] : (rasters as any);
      const bandG = Array.isArray(rasters) && numBands >= 2 ? rasters[1] : bandR;
      const bandB = Array.isArray(rasters) && numBands >= 3 ? rasters[2] : bandR;

      // Calculate min/max percentile for contrast stretching
      let minR = Infinity, maxR = -Infinity;
      let minG = Infinity, maxG = -Infinity;
      let minB = Infinity, maxB = -Infinity;

      const totalPixels = width * height;
      const sampleStep = Math.max(1, Math.floor(totalPixels / 5000)); // Sample 5k pixels for fast stats

      for (let i = 0; i < totalPixels; i += sampleStep) {
        const vr = Number(bandR[i]) || 0;
        const vg = Number(bandG[i]) || 0;
        const vb = Number(bandB[i]) || 0;
        if (vr < minR) minR = vr;
        if (vr > maxR) maxR = vr;
        if (vg < minG) minG = vg;
        if (vg > maxG) maxG = vg;
        if (vb < minB) minB = vb;
        if (vb > maxB) maxB = vb;
      }

      // If max is 0 (all black), fallback bounds
      if (maxR <= minR) { minR = 0; maxR = 255; }
      if (maxG <= minG) { minG = 0; maxG = 255; }
      if (maxB <= minB) { minB = 0; maxB = 255; }

      const rangeR = maxR - minR || 1;
      const rangeG = maxG - minG || 1;
      const rangeB = maxB - minB || 1;

      // Populate canvas RGBA buffer with stretched values
      for (let i = 0; i < totalPixels; i++) {
        const pxIdx = i * 4;
        const vr = Number(bandR[i]) || 0;
        const vg = Number(bandG[i]) || 0;
        const vb = Number(bandB[i]) || 0;

        // Auto-scale to 0-255
        data[pxIdx] = Math.min(255, Math.max(0, Math.round(((vr - minR) / rangeR) * 255)));
        data[pxIdx + 1] = Math.min(255, Math.max(0, Math.round(((vg - minG) / rangeG) * 255)));
        data[pxIdx + 2] = Math.min(255, Math.max(0, Math.round(((vb - minB) / rangeB) * 255)));
        data[pxIdx + 3] = 255; // Alpha
      }

      ctx.putImageData(imgData, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');

      return {
        dataUrl,
        name: fileName,
        size: sizeFormatted,
        format: `Sentinel-2 GeoTIFF (${width}x${height})`
      };
    } catch (geotiffErr) {
      console.warn('GeoTIFF.js decode notice, trying UTIF fallback:', geotiffErr);
    }

    // Secondary fallback: UTIF
    try {
      const ifds = UTIF.decode(arrayBuffer);
      if (ifds && ifds.length > 0) {
        UTIF.decodeImage(arrayBuffer, ifds[0]);
        const rgba = UTIF.toRGBA8(ifds[0]);
        const width = ifds[0].width;
        const height = ifds[0].height;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        const imgData = ctx.createImageData(width, height);

        // Find min/max for stretching
        let minVal = 255, maxVal = 0;
        for (let i = 0; i < rgba.length; i += 4) {
          const m = Math.max(rgba[i], rgba[i+1], rgba[i+2]);
          if (m > maxVal) maxVal = m;
          if (m < minVal) minVal = m;
        }

        const range = maxVal - minVal || 1;
        for (let i = 0; i < rgba.length; i += 4) {
          imgData.data[i] = Math.round(((rgba[i] - minVal) / range) * 255);
          imgData.data[i + 1] = Math.round(((rgba[i + 1] - minVal) / range) * 255);
          imgData.data[i + 2] = Math.round(((rgba[i + 2] - minVal) / range) * 255);
          imgData.data[i + 3] = 255;
        }

        ctx.putImageData(imgData, 0, 0);
        return {
          dataUrl: canvas.toDataURL('image/png'),
          name: fileName,
          size: sizeFormatted,
          format: 'GeoTIFF / TIFF'
        };
      }
    } catch (utifErr) {
      console.warn('UTIF fallback failed:', utifErr);
    }

    return {
      dataUrl: URL.createObjectURL(file),
      name: fileName,
      size: sizeFormatted,
      format: 'TIFF'
    };
  }

  // 3. Handle standard images (PNG, JPG, JPEG, WEBP)
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
