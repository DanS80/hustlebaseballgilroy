#!/bin/bash

# Change to the script's directory
cd "$(dirname "$0")"

# Resize images
echo "Resizing images..."
python3 image_resize.py

# Generate the image index
echo "Generating image index..."
python3 generate_image_index.py

# Update sitemap timestamps
echo "Updating sitemap..."
python3 update_sitemap.py

# Add and commit the changes if git is present
if [ -d "../.git" ]; then
    echo "Committing changes..."
    git add ../photos/image-index.json
    git add ../photos/*.webp
    git add ../sitemap.xml
    git commit -m "Update photos, index, and sitemap"
    
    # Ask about pushing changes
    read -p "Do you want to push changes to remote? (y/N) " push_changes
    if [[ $push_changes =~ ^[Yy]$ ]] && git remote | grep -q "origin"; then
        echo "Pushing changes..."
        git push
    fi
fi

echo "Deployment complete!"