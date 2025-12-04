from PIL import Image
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
    'skills.jpg': 'skills.jpg',  # Assuming this exists
    'peer_room..jpg': 'peer_room.jpg'  # Note the double dots in source
}

for src_name, dest_name in images.items():
    src_path = os.path.join(source_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)

    if not os.path.exists(src_path):
        print(f'Skipping {src_name} - file not found')
        continue

    try:
        # Open image
        img = Image.open(src_path)
        print(f'Processing {src_name}: mode={img.mode}, size={img.size}')

        # Convert to RGBA if needed
        if img.mode != 'RGBA':
            if img.mode == 'P' and 'transparency' in img.info:
                img = img.convert('RGBA')
            elif img.mode in ('LA', 'L'):
                img = img.convert('RGBA')

        # Create white background
        white_bg = Image.new('RGB', img.size, (255, 255, 255))

        # Paste image on white background
        if img.mode == 'RGBA':
            white_bg.paste(img, mask=img.split()[3])  # Use alpha channel as mask
            print(f'  -> Composited RGBA on white background')
        else:
            white_bg.paste(img)
            print(f'  -> Direct paste (no alpha)')

        # Save as JPG with white background
        white_bg.save(dest_path, 'JPEG', quality=95, optimize=True)
        print(f'  -> Saved to {dest_name}')

    except Exception as e:
        print(f'Error processing {src_name}: {e}')

print('\nDone!')
