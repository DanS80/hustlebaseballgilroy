import os
import datetime
from pathlib import Path
import xml.etree.ElementTree as ET

def update_sitemap():
    sitemap_path = '../sitemap.xml'
    
    if not os.path.exists(sitemap_path):
        print("Error: sitemap.xml not found")
        return

    # Register namespace to avoid ns0: prefixes
    ET.register_namespace('', "http://www.sitemaps.org/schemas/sitemap/0.9")
    
    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    
    updated_count = 0
    
    for url in root.findall('{http://www.sitemaps.org/schemas/sitemap/0.9}url'):
        loc = url.find('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')
        lastmod = url.find('{http://www.sitemaps.org/schemas/sitemap/0.9}lastmod')
        
        if loc is None or loc.text is None:
            continue
            
        # Extract filename from URL
        filename = loc.text.split('/')[-1]
        if not filename: # Handle root url ending in /
            filename = 'index.html'
            
        file_path = os.path.join('..', filename)
        
        if os.path.exists(file_path):
            # Get file modification time
            mtime = os.path.getmtime(file_path)
            date_str = datetime.datetime.fromtimestamp(mtime).strftime('%Y-%m-%d')
            
            if lastmod is not None:
                if lastmod.text != date_str:
                    print(f"Updating {filename}: {lastmod.text} -> {date_str}")
                    lastmod.text = date_str
                    updated_count += 1
            else:
                # Create lastmod if it doesn't exist
                new_lastmod = ET.SubElement(url, '{http://www.sitemaps.org/schemas/sitemap/0.9}lastmod')
                new_lastmod.text = date_str
                print(f"Adding lastmod to {filename}: {date_str}")
                updated_count += 1
                
    if updated_count > 0:
        tree.write(sitemap_path, encoding='UTF-8', xml_declaration=True)
        print(f"Updated {updated_count} entries in sitemap.xml")
    else:
        print("No sitemap updates needed")

if __name__ == '__main__':
    update_sitemap()
