document.addEventListener('DOMContentLoaded', function() {
    let currentImageIndex = 0;
    let images = [];
    let imageData = [];
    let filteredImages = [];
    
    // Function to load images from the photos directory
    async function loadImages() {
        try {
            const response = await fetch('photos/image-index.json');
            const data = await response.json();
            imageData = data.images;
            images = imageData.map(img => img.path);
            filteredImages = imageData;
            displayImages();
        } catch (error) {
            console.error('Error loading images:', error);
        }
    }

    function displayImages() {
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';
        filteredImages.forEach((img, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-item';
            const image = document.createElement('img');
            image.src = img.path;
            image.alt = `Gallery image ${index + 1}`;
            image.addEventListener('click', () => openLightbox(index));
            imgContainer.appendChild(image);
            // Add date and location
            const meta = document.createElement('div');
            meta.className = 'gallery-meta';
            const date = new Date(img.date * 1000);
            meta.innerHTML = `<span class='gallery-date'>${isNaN(date) ? '' : date.toLocaleDateString()}</span> <span class='gallery-location'>${img.location || ''}</span>`;
            imgContainer.appendChild(meta);
            gallery.appendChild(imgContainer);
        });
    }

    // Filtering
    document.getElementById('team-filter').addEventListener('change', function() {
        const value = this.value;
        if (value === 'all') {
            filteredImages = imageData;
        } else {
            filteredImages = imageData.filter(img => (img.team || '').toLowerCase() === value);
        }
        displayImages();
    });

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    function openLightbox(index) {
        currentImageIndex = index;
        lightbox.style.display = 'flex';
        showImage(index);
    }

    function showImage(index) {
        lightboxImg.src = filteredImages[index].path;
    }

    // Close button
    document.querySelector('.close-btn').onclick = () => {
        lightbox.style.display = 'none';
    };

    // Previous/Next navigation
    document.querySelector('.prev').onclick = () => {
        currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
        showImage(currentImageIndex);
    };

    document.querySelector('.next').onclick = () => {
        currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
        showImage(currentImageIndex);
    };

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') document.querySelector('.prev').click();
            if (e.key === 'ArrowRight') document.querySelector('.next').click();
            if (e.key === 'Escape') document.querySelector('.close-btn').click();
        }
    });

    // Load images when page loads
    loadImages();
});
