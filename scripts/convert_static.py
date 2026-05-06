import os
import subprocess
from pathlib import Path

def convert_static_images():
    base_dirs = [Path('images'), Path('.')] # Include root for logo.png
    
    for base_dir in base_dirs:
        # Recursive for images/, non-recursive for root (manually filtered)
        if base_dir.name == '.':
            files = [Path('logo.png'), Path('logo2.png'), Path('logo3.png')]
        else:
            files = base_dir.rglob('*')
            
        for file_path in files:
            if not file_path.exists():
                continue
                
            if file_path.suffix.lower() in ['.png', '.jpg', '.jpeg']:
                try:
                    new_path = file_path.with_suffix('.webp')
                    
                    # Skip if already exists
                    if new_path.exists():
                        print(f"Skipping {new_path} (already exists)")
                        continue

                    print(f"Converting {file_path} -> {new_path}")
                    subprocess.run(['cwebp', '-q', '85', str(file_path), '-o', str(new_path)], check=True)
                    
                except Exception as e:
                    print(f"Error converting {file_path}: {e}")

if __name__ == '__main__':
    convert_static_images()
