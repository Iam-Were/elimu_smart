from PIL import Image
import numpy as np
import os

# Source and destination
source_dir = r'C:\Users\c\Downloads\LOGO'
dest_dir = r'C:\Users\c\Documents\GitHub\elimu_smart\frontend\public\design'

# Image mappings (source -> destination)
images = {
    'riasec_career_explorer.jpg': 'riasec.jpg',
    'career_explorer.jpg': 'career-explorer.jpg',
    'university_finder.jpg': 'university-finder.jpg',
    'subject_mapper.jpg': 'subject-mapper.jpg',
    'peer_room..jpg': 'peer_room.jpg'
}

def replace_checkerboard_with_white(img_path):
    """Replace checkerboard transparency pattern with solid white"""
    img = Image.open(img_path)
    img_array = np.array(img)

    # Checkerboard pattern colors (light and dark gray)
    # Common checkerboard colors: RGB(204, 204, 204) and RGB(255, 255, 255)
    # or RGB(192, 192, 192) and RGB(255, 255, 255)

    # Replace all grays (R==G==B and value > 180) with white
    gray_mask = (
        (img_array[:, :, 0] == img_array[:, :, 1]) &
        (img_array[:, :, 1] == img_array[:, :, 2]) &
        (img_array[:, :, 0] >= 180)
    )

    # Set matching pixels to white
    img_array[gray_mask] = [255, 255, 255]

    return Image.fromarray(img_array)

for src_name, dest_name in images.items():
    src_path = os.path.join(source_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)

    if not os.path.exists(src_path):
        print(f'Skipping {src_name} - file not found')
        continue

    try:
        print(f'Processing {src_name}...')
        result_img = replace_checkerboard_with_white(src_path)
        result_img.save(dest_path, 'JPEG', quality=95, optimize=True)
        print(f'  -> Saved {dest_name} with white background')
    except Exception as e:
        print(f'Error processing {src_name}: {e}')

print('\nDone! Checkerboard patterns replaced with solid white.')
