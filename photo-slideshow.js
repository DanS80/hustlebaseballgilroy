document.addEventListener('DOMContentLoaded', function() {
    let images = [];
    const slideshowContainers = [
        document.getElementById('slideshow1'),
        document.getElementById('slideshow2'),
        document.getElementById('slideshow3')
    ];
    
    async function loadImages() {
        try {
            const response = await fetch('photos/');
            const data = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const links = Array.from(doc.getElementsByTagName('a'));
            
            images = links
                .map(link => link.href)
                .filter(href => href.match(/\.(jpg|jpeg|png|gif)$/i));
            
            initializeSlideshows();
        } catch (error) {
            console.error('Error loading images:', error);
        }
    }

    function initializeSlideshows() {
        slideshowContainers.forEach((container, index) => {
            const img = document.createElement('img');
            img.src = images[index % images.length];
            container.appendChild(img);
            
            // Start rotation with different delays for each container
            setInterval(() => {
                rotateImage(container, index);
            }, 3000 + (index * 1000)); // Stagger the transitions
        });
    }

    function rotateImage(container, containerIndex) {
        const currentImg = container.querySelector('img');
        let nextIndex = Math.floor(Math.random() * images.length);
        
        // Create and add new image
        const newImg = document.createElement('img');
        newImg.src = images[nextIndex];
        newImg.style.opacity = '0';
        container.appendChild(newImg);

        // Fade out old image, fade in new image
        setTimeout(() => {
            currentImg.style.opacity = '0';
            newImg.style.opacity = '1';
            // Remove old image after transition
            setTimeout(() => {
                currentImg.remove();
            }, 500);
        }, 50);
    }

    loadImages();
});
