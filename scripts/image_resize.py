import os
from PIL import Image

def resize_and_save_images(image_directory, max_width=1024, max_height=800):
    """Resizes images in a directory if they exceed max_width or max_height,
       and saves them as JPG. Maintains aspect ratio. Converts PNGs to JPG.

    Args:
        image_directory: Path to the image directory.
        max_width: Maximum width.
        max_height: Maximum height.
    """

    for filename in os.listdir(image_directory):
        if not filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            continue

        filepath = os.path.join(image_directory, filename)

        try:
            img = Image.open(filepath)
            width, height = img.size

            # Resize if needed
            if width > max_width or height > max_height:
                ratio = min(max_width / width, max_height / height)
                new_width = int(width * ratio)
                new_height = int(height * ratio)
                img = img.resize((new_width, new_height), Image.LANCZOS)

            # Always save as JPG
            new_filename = os.path.splitext(filename)[0] + ".jpg"
            new_filepath = os.path.join(image_directory, new_filename)

            if img.format != 'JPEG':
                img = img.convert('RGB')

            img.save(new_filepath, "JPEG", optimize=True)
            print(f"Saved as JPG: {filename} as {new_filename}")

            if filename != new_filename:
                os.remove(filepath)
                print(f"Removed old file: {filename}")

        except Exception as e:
            print(f"Error processing {filename}: {e}")


# Example usage:
image_directory = "../photos/"  # Replace with the actual path
resize_and_save_images(image_directory)

# Example with custom dimensions (if you want to override the 1024x660):
# resize_and_save_images(image_directory, max_width=800, max_height=400)