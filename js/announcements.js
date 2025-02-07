async function loadAnnouncements() {
    try {
        const response = await fetch('announcements.md');
        const markdown = await response.text();
        const htmlContent = marked.parse(markdown);
        document.querySelector('.announcement').innerHTML = htmlContent;
    } catch (error) {
        console.error('Error loading announcements:', error);
        document.querySelector('.announcement').innerHTML = '<p>Unable to load announcements</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadAnnouncements);
