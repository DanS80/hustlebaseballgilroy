document.addEventListener('DOMContentLoaded', function() {
    let currentImageIndex = 0;
    let images = [];
    
    // Function to load images from the photos directory
    async function loadImages() {
        try {
            const response = await fetch('photos/image-index.json');
            const data = await response.json();
            images = data.images.map(img => img.path);
            displayImages();
        } catch (error) {
            console.error('Error loading images:', error);
        }
    }

    function displayImages() {
        const gallery = document.getElementById('gallery');
        images.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Gallery image ${index + 1}`;
            img.addEventListener('click', () => openLightbox(index));
            gallery.appendChild(img);
        });
    }

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    function openLightbox(index) {
        currentImageIndex = index;
        lightbox.style.display = 'flex';
        showImage(index);
    }

    function showImage(index) {
        lightboxImg.src = images[index];
    }

    // Close button
    document.querySelector('.close-btn').onclick = () => {
        lightbox.style.display = 'none';
    };

    // Previous/Next navigation
    document.querySelector('.prev').onclick = () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        showImage(currentImageIndex);
    };

    document.querySelector('.next').onclick = () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
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
