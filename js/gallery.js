document.addEventListener('DOMContentLoaded', function() {
    let currentImageIndex = 0;
    let images = [];
    let imageData = [];
    let filteredImages = [];
    let currentPage = 1;
    const imagesPerPage = 24; // 24 images per page (4x6 grid or 3x8 depending on screen)

    // Function to load images from the photos directory
    async function loadImages() {
        try {
            const response = await fetch('photos/image-index.json');
            const data = await response.json();
            imageData = data.images;
            images = imageData.map(img => img.path);
            filteredImages = imageData;
            displayImages();
            displayPagination();
        } catch (error) {
            console.error('Error loading images:', error);
        }
    }

    function displayImages() {
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';

        // Calculate start and end indices for current page
        const startIndex = (currentPage - 1) * imagesPerPage;
        const endIndex = startIndex + imagesPerPage;
        const pageImages = filteredImages.slice(startIndex, endIndex);

        if (pageImages.length === 0) {
            gallery.innerHTML = '<p class="no-images">No images to display</p>';
            return;
        }

        pageImages.forEach((img, index) => {
            const actualIndex = startIndex + index; // Index in the full filtered array
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-item';
            const image = document.createElement('img');
            image.src = img.path;
            image.alt = `Gallery image ${actualIndex + 1}`;
            image.addEventListener('click', () => openLightbox(actualIndex));
            imgContainer.appendChild(image);
            // Add date and location
            const meta = document.createElement('div');
            meta.className = 'gallery-meta';
            const date = new Date(img.date * 1000);
            meta.innerHTML = `<span class='gallery-date'>${isNaN(date) ? '' : date.toLocaleDateString()}</span> <span class='gallery-location'>${img.location || ''}</span>`;
            imgContainer.appendChild(meta);
            gallery.appendChild(imgContainer);
        });

        // Scroll to top of gallery
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function displayPagination() {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

        if (totalPages <= 1) {
            return; // Don't show pagination if only one page
        }

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '« Previous';
        prevBtn.className = 'pagination-btn' + (currentPage === 1 ? ' disabled' : '');
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayImages();
                displayPagination();
            }
        });
        pagination.appendChild(prevBtn);

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start if we're near the end
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page and ellipsis
        if (startPage > 1) {
            addPageButton(1);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                pagination.appendChild(ellipsis);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            addPageButton(i);
        }

        // Last page and ellipsis
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                pagination.appendChild(ellipsis);
            }
            addPageButton(totalPages);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next »';
        nextBtn.className = 'pagination-btn' + (currentPage === totalPages ? ' disabled' : '');
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayImages();
                displayPagination();
            }
        });
        pagination.appendChild(nextBtn);

        // Add page info
        const pageInfo = document.createElement('span');
        pageInfo.className = 'pagination-info';
        pageInfo.textContent = `Page ${currentPage} of ${totalPages} (${filteredImages.length} photos)`;
        pagination.appendChild(pageInfo);
    }

    function addPageButton(pageNum) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = pageNum;
        pageBtn.className = 'pagination-btn page-number' + (pageNum === currentPage ? ' active' : '');
        pageBtn.addEventListener('click', () => {
            currentPage = pageNum;
            displayImages();
            displayPagination();
        });
        document.getElementById('pagination').appendChild(pageBtn);
    }

    // Filtering
    document.getElementById('team-filter').addEventListener('change', function() {
        const value = this.value;
        if (value === 'all') {
            filteredImages = imageData;
        } else {
            filteredImages = imageData.filter(img => (img.team || '').toLowerCase() === value);
        }
        currentPage = 1; // Reset to first page when filtering
        displayImages();
        displayPagination();
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
