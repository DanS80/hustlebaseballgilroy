import os
import json
from pathlib import Path

def generate_image_index():
    # Path to photos directory
    photos_dir = Path('../photos')
    
    # Get all image files
    image_files = []
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.gif']:
        image_files.extend(list(photos_dir.glob(ext)))
        image_files.extend(list(photos_dir.glob(ext.upper())))
    
    # Create image list with metadata
    images = []
    for img in sorted(image_files):
        images.append({
            'path': f'photos/{img.name}',
            'name': img.stem,
            'date': img.stat().st_mtime
        })
    
    # Write to JSON file
    with open('../photos/image-index.json', 'w') as f:
        json.dump({'images': images}, f, indent=2)

if __name__ == '__main__':
    generate_image_index()
