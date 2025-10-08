import os
from PIL import Image
from pathlib import Path

def resize_and_save_images(image_directory, max_width=1024, max_height=800):
    """Resizes images in a directory if they exceed max_width or max_height,
       and saves them as JPG. Maintains aspect ratio. Converts PNGs to JPG.
       Only resizes if the image is larger than the specified dimensions.

    Args:
        image_directory: Path to the image directory.
        max_width: Maximum width.
        max_height: Maximum height.
    """

    processed = 0
    resized = 0
    converted = 0
    skipped = 0

    for filename in os.listdir(image_directory):
        if not filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            continue

        filepath = os.path.join(image_directory, filename)

        # Skip if it's a directory
        if os.path.isdir(filepath):
            continue

        try:
            img = Image.open(filepath)
            width, height = img.size
            needs_resize = width > max_width or height > max_height
            needs_conversion = img.format != 'JPEG'

            # Skip if already the right size and format
            if not needs_resize and not needs_conversion and filename.lower().endswith('.jpg'):
                print(f"✓ Skipped (already optimized): {filename} ({width}x{height})")
                skipped += 1
                continue

            processed += 1

            # Resize if needed
            if needs_resize:
                ratio = min(max_width / width, max_height / height)
                new_width = int(width * ratio)
                new_height = int(height * ratio)
                img = img.resize((new_width, new_height), Image.LANCZOS)
                print(f"↓ Resizing: {filename} from {width}x{height} to {new_width}x{new_height}")
                resized += 1

            # Convert to RGB if needed (for PNG/GIF with transparency)
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')

            # Save as JPG
            new_filename = os.path.splitext(filename)[0] + ".jpg"
            new_filepath = os.path.join(image_directory, new_filename)

            img.save(new_filepath, "JPEG", optimize=True, quality=85)

            if needs_conversion:
                print(f"→ Converted: {filename} to {new_filename}")
                converted += 1
            else:
                print(f"✓ Saved: {new_filename}")

            # Remove old file if format changed
            if filename != new_filename and os.path.exists(filepath):
                os.remove(filepath)
                print(f"✗ Removed: {filename}")

        except Exception as e:
            print(f"✗ Error processing {filename}: {e}")

    return processed, resized, converted, skipped


def process_all_subdirectories(base_directory, max_width=1024, max_height=800):
    """Process images in all subdirectories."""
    base_path = Path(base_directory)
    team_dirs = ['10U', '11U', 'SJGiants']

    total_processed = 0
    total_resized = 0
    total_converted = 0
    total_skipped = 0

    for team_dir in team_dirs:
        team_path = base_path / team_dir
        if not team_path.exists():
            print(f"\n⚠ Directory not found: {team_path}")
            continue

        print(f"\n{'='*60}")
        print(f"Processing: {team_dir}")
        print(f"{'='*60}")

        processed, resized, converted, skipped = resize_and_save_images(
            str(team_path), max_width, max_height
        )

        total_processed += processed
        total_resized += resized
        total_converted += converted
        total_skipped += skipped

        print(f"\n{team_dir} Summary:")
        print(f"  Processed: {processed}")
        print(f"  Resized: {resized}")
        print(f"  Converted: {converted}")
        print(f"  Skipped: {skipped}")

    print(f"\n{'='*60}")
    print(f"TOTAL SUMMARY")
    print(f"{'='*60}")
    print(f"Total Processed: {total_processed}")
    print(f"Total Resized: {total_resized}")
    print(f"Total Converted: {total_converted}")
    print(f"Total Skipped: {total_skipped}")
    print(f"{'='*60}\n")


if __name__ == '__main__':
    photos_directory = "../photos/"
    process_all_subdirectories(photos_directory, max_width=1024, max_height=800)