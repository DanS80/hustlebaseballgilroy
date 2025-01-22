function updateCopyrightYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

document.addEventListener('DOMContentLoaded', updateCopyrightYear);

// Load header and footer
fetch('header.html')
    .then(response => response.text())
    .then(data => document.getElementById('header').innerHTML = data);

fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
        updateCopyrightYear(); // Update year after footer is loaded
    });
