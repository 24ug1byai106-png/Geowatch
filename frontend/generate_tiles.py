import os
import numpy as np
import cv2

def generate_whitefield_satellite_tiles():
    out_dir = r"c:\Projects\Isro\frontend\public\data"
    os.makedirs(out_dir, exist_ok=True)
    
    w, h = 600, 600
    
    # 2024 Baseline Satellite Image (More green canopy, agricultural plots, fewer buildings)
    np.random.seed(42)
    base_2024 = np.zeros((h, w, 3), dtype=np.uint8)
    
    # Base terrain (suburban soil and vegetation mix)
    for y in range(h):
        for x in range(w):
            base_2024[y, x] = [
                35 + int(np.sin(x/30.0)*10 + np.random.randint(-5, 5)), # B
                65 + int(np.cos(y/30.0)*15 + np.random.randint(-5, 5)), # G (greener)
                45 + int(np.random.randint(-5, 5))                      # R
            ]
            
    # Major Highway in 2024 (2-lane)
    cv2.line(base_2024, (50, 300), (550, 300), (90, 95, 100), 12)
    cv2.line(base_2024, (300, 50), (300, 550), (90, 95, 100), 10)
    
    # Agricultural plots in 2024 (Quadrant 1 and Quadrant 4)
    cv2.rectangle(base_2024, (80, 80), (220, 220), (30, 110, 45), -1) # lush field
    cv2.rectangle(base_2024, (360, 360), (520, 500), (35, 120, 50), -1) # lush field
    cv2.rectangle(base_2024, (370, 90), (490, 210), (40, 90, 60), -1) # canopy
    
    # Existing modest buildings (2024)
    cv2.rectangle(base_2024, (90, 340), (140, 390), (140, 145, 150), -1)
    cv2.rectangle(base_2024, (160, 350), (210, 410), (130, 135, 140), -1)
    
    # 2025 Comparison Satellite Image (New tech complexes, widened 6-lane road, cleared field)
    base_2025 = base_2024.copy()
    
    # 1. Highway Expansion: Widened to 6-lane paved highway
    cv2.line(base_2025, (50, 300), (550, 300), (160, 165, 175), 24)
    
    # 2. Field in Quadrant 1 converted to Large IT Tech Campus (Concrete / Glass roofs)
    cv2.rectangle(base_2025, (80, 80), (220, 220), (100, 110, 115), -1) # cleared ground
    cv2.rectangle(base_2025, (95, 95), (145, 150), (195, 200, 210), -1) # Building Block A
    cv2.rectangle(base_2025, (155, 95), (205, 150), (180, 185, 195), -1) # Building Block B
    cv2.rectangle(base_2025, (110, 160), (190, 205), (160, 170, 180), -1) # Building Block C
    
    # 3. Field in Quadrant 4 cleared for construction staging (Canopy loss)
    cv2.rectangle(base_2025, (360, 360), (520, 500), (85, 95, 105), -1) # bare earth / leveled
    cv2.rectangle(base_2025, (390, 380), (480, 440), (170, 175, 185), -1) # New Foundation
    
    # 4. New logistics hub in Quadrant 2
    cv2.rectangle(base_2025, (370, 90), (490, 210), (90, 95, 100), -1) # canopy cleared
    cv2.rectangle(base_2025, (390, 110), (470, 190), (210, 215, 220), -1) # New commercial warehouse
    
    # Save PNG web previews
    p2024_png = os.path.join(out_dir, "whitefield_2024_preview.png")
    p2025_png = os.path.join(out_dir, "whitefield_2025_preview.png")
    
    cv2.imwrite(p2024_png, base_2024)
    cv2.imwrite(p2025_png, base_2025)
    
    # Save TIFF source files
    t2024_tif = os.path.join(out_dir, "whitefield_2024_optimized.tif")
    t2025_tif = os.path.join(out_dir, "whitefield_2025_optimized.tif")
    
    cv2.imwrite(t2024_tif, base_2024)
    cv2.imwrite(t2025_tif, base_2025)
    
    print("Generated Whitefield satellite observation assets successfully!")

if __name__ == "__main__":
    generate_whitefield_satellite_tiles()
