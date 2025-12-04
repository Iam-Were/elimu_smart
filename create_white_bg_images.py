from PIL import Image, ImageDraw
import os

# Source and destination
source_dir = r'C:\Users\c\Downloads\LOGO'
dest_dir = r'C:\Users\c\Documents\GitHub\elimu_smart\frontend\public\design'

# Image mappings
images = {
    'riasec_career_explorer.jpg': 'riasec.jpg',
    'career_explorer.jpg': 'career-explorer.jpg',
    'university_finder.jpg': 'university-finder.jpg',
    'subject_mapper.jpg': 'subject-mapper.jpg',
    'skill_assesment.jpg': 'skills.jpg',
    'peer_room.jpg': 'peer_room.jpg'
}

for src_name, dest_name in images.items():
    src_path = os.path.join(source_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)

    if not os.path.exists(src_path):
        print(f'Skipping {src_name} - not found')
        continue

    try:
        # Open the image
        img = Image.open(src_path)

        # Create a pure white background of the same size
        white_bg = Image.new('RGB', img.size, (255, 255, 255))

        # Convert image to RGBA if needed
        if img.mode != 'RGBA':
            img = img.convert('RGBA')

        # Composite the image onto white background
        white_bg.paste(img, (0, 0), img)

        # Save as JPG with high quality
        white_bg.save(dest_path, 'JPEG', quality=95, optimize=True)
        print(f'✓ Created {dest_name} with pure white background')

    except Exception as e:
        print(f'✗ Error processing {src_name}: {e}')

print('\nAll images processed!')
