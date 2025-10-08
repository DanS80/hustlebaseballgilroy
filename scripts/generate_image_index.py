import os
import json
from pathlib import Path

def generate_image_index():
    # Path to photos directory
    photos_dir = Path('../photos')

    # Team subdirectories to scan
    team_dirs = ['10U', '11U', 'SJGiants']

    # Get all image files from subdirectories
    images = []

    for team_dir in team_dirs:
        team_path = photos_dir / team_dir
        if not team_path.exists():
            continue

        # Get all image files in this team directory
        image_files = []
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.gif']:
            image_files.extend(list(team_path.glob(ext)))
            image_files.extend(list(team_path.glob(ext.upper())))

        # Add images with team metadata
        for img in sorted(image_files):
            images.append({
                'path': f'photos/{team_dir}/{img.name}',
                'name': img.stem,
                'date': img.stat().st_mtime,
                'team': team_dir.lower(),  # '10u', '11u', or 'sjgiants'
                'location': ''
            })

    # Sort by date (newest first)
    images.sort(key=lambda x: x['date'], reverse=True)

    # Write to JSON file
    with open('../photos/image-index.json', 'w') as f:
        json.dump({'images': images}, f, indent=2)

    print(f"Generated index with {len(images)} images")
    for team_dir in team_dirs:
        count = sum(1 for img in images if img['team'] == team_dir.lower())
        print(f"  {team_dir}: {count} images")

if __name__ == '__main__':
    generate_image_index()
