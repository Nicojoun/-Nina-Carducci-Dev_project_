import { mauGallery } from 'maugallery_vanilla.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the gallery
    var galleryElements = document.querySelectorAll('.gallery');
    galleryElements.forEach(function(gallery) {
        mauGallery(gallery, {
            columns: {
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 3
            },
            lightBox: true,
            lightboxId: 'myAwesomeLightbox',
            showTags: true,
            tagsPosition: 'top'
        });
    });

    // Form validation
    var forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            var emailField = form.querySelector('input[type="email"]');
            var email = emailField.value.trim();

            // Regex to check if the email contains a dot and the part after it
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                event.preventDefault(); // Prevent form submission
            }
        });
    });
});