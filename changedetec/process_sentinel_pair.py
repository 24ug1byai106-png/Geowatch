import os
import sys
import cv2
import numpy as np
import json

def process_sentinel_datasets():
    print("[INFO] Starting Sentinel-2 2024 vs 2026 Processing Pipeline...")

    path_2024 = "S2B_MSIL1C_20241208T051119_N0511_R019_T43PGQ_20241208T073956.SAFE/GRANULE/L1C_T43PGQ_A040514_20241208T052013/IMG_DATA/T43PGQ_20241208T051119_TCI.jp2"
    path_2026 = "S2B_MSIL1C_20260512T050649_N0512_R019_T43PGQ_20260512T084111.SAFE/GRANULE/L1C_T43PGQ_A047950_20260512T052201/IMG_DATA/T43PGQ_20260512T050649_TCI.jp2"

    if not os.path.exists(path_2024) or not os.path.exists(path_2026):
        print("Error: Sentinel dataset paths not found!")
        return

    print("Loading 2024 TCI image...")
    tci_2024 = cv2.imread(path_2024)
    print("Loading 2026 TCI image...")
    tci_2026 = cv2.imread(path_2026)

    h, w = tci_2024.shape[:2]
    print(f"Full Sentinel-2 Tile Dimensions: {w}x{h}")

    # Crop the central-east high-growth metropolitan region (Whitefield, IT Corridor, Bellandur, Sarjapur)
    # Tile center corresponds to Bengaluru metropolitan area
    crop_x = int(w * 0.40)
    crop_y = int(h * 0.45)
    crop_size = 2800

    crop_2024 = tci_2024[crop_y:crop_y+crop_size, crop_x:crop_x+crop_size]
    crop_2026 = tci_2026[crop_y:crop_y+crop_size, crop_x:crop_x+crop_size]

    # Resize to clean, crisp 1024x1024 web assets
    web_size = (1024, 1024)
    preview_2024 = cv2.resize(crop_2024, web_size, interpolation=cv2.INTER_AREA)
    preview_2026 = cv2.resize(crop_2026, web_size, interpolation=cv2.INTER_AREA)

    # Convert to grayscale for differencing
    gray_2024 = cv2.cvtColor(preview_2024, cv2.COLOR_BGR2GRAY)
    gray_2026 = cv2.cvtColor(preview_2026, cv2.COLOR_BGR2GRAY)

    # Histogram equalization for lighting normalization
    norm_2024 = cv2.equalizeHist(gray_2024)
    norm_2026 = cv2.equalizeHist(gray_2026)

    # Absolute difference
    diff = cv2.absdiff(norm_2024, norm_2026)
    blurred = cv2.GaussianBlur(diff, (9, 9), 0)
    _, thresh = cv2.threshold(blurred, 42, 255, cv2.THRESH_BINARY)

    # Morphological noise removal
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    cleaned = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_CLOSE, kernel)

    changed_pixels = cv2.countNonZero(cleaned)
    total_pixels = web_size[0] * web_size[1]
    change_pct = round((changed_pixels / total_pixels) * 100, 2)
    print(f"Detected Change Percentage: {change_pct}%")

    # Contours extraction
    contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    min_area = 100
    valid_contours = [c for c in contours if cv2.contourArea(c) >= min_area]
    print(f"Total Significant Change Contours: {len(valid_contours)}")

    # Create change heatmap overlay
    heatmap = np.zeros_like(preview_2026)
    heatmap[cleaned > 0] = [0, 240, 255] # Cyan / Amber for changes
    overlay = cv2.addWeighted(preview_2026, 0.75, heatmap, 0.45, 0)

    # Ensure output folders exist
    out_dir = "frontend/public/data"
    os.makedirs(out_dir, exist_ok=True)

    cv2.imwrite(os.path.join(out_dir, "sentinel_2024_bengaluru.png"), preview_2024)
    cv2.imwrite(os.path.join(out_dir, "sentinel_2026_bengaluru.png"), preview_2026)
    cv2.imwrite(os.path.join(out_dir, "sentinel_change_overlay.png"), overlay)
    cv2.imwrite(os.path.join(out_dir, "sentinel_change_mask.png"), cleaned)

    # Also save to changedetec/uploads/
    backend_uploads = "changedetec/uploads"
    os.makedirs(backend_uploads, exist_ok=True)
    cv2.imwrite(os.path.join(backend_uploads, "sentinel_2024_bengaluru.png"), preview_2024)
    cv2.imwrite(os.path.join(backend_uploads, "sentinel_2026_bengaluru.png"), preview_2026)

    # Save summary metadata
    meta = {
        "dataset_name": "Bengaluru Metropolitan Tech Corridor (2024 vs 2026)",
        "mission": "Sentinel-2B Level-1C (MSI)",
        "tile": "T43PGQ",
        "before_sensing_time": "2024-12-08T05:11:19Z",
        "after_sensing_time": "2026-05-12T05:06:49Z",
        "spatial_resolution": "10m GSD",
        "change_percentage": change_pct,
        "change_regions_count": len(valid_contours),
        "total_changed_sq_meters": int(changed_pixels * 100),
        "utm_crs": "EPSG:32643 (UTM Zone 43N)"
    }

    with open(os.path.join(out_dir, "sentinel_analysis_summary.json"), "w") as f:
        json.dump(meta, f, indent=2)

    print("[SUCCESS] Processing Complete! Assets generated in frontend/public/data/ and backend uploads.")

if __name__ == "__main__":
    process_sentinel_datasets()
