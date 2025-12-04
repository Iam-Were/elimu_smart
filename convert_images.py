from PIL import Image
import os

# Change to the design directory
os.chdir('frontend/public/design')

# List of image files
images = ['riasec.jpg', 'skills.jpg', 'university-finder.jpg', 'career-explorer.jpg', 'subject-mapper.jpg', 'peer_room.jpg']

for img_name in images:
    try:
        # Open image
        img = Image.open(img_name)

        # Create white background
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            # Create white background
            white_bg = Image.new('RGB', img.size, (255, 255, 255))

            # Paste image on white background
            if img.mode == 'P':
                img = img.convert('RGBA')
            white_bg.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)

            # Save as JPG with white background
            white_bg.save(img_name, 'JPEG', quality=95)
            print(f'Converted {img_name} to white background')
        else:
            print(f'{img_name} already has no transparency')
    except Exception as e:
        print(f'Error processing {img_name}: {e}')

print('Done!')
