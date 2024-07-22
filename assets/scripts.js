$(document).ready(function() {
    $('.gallery').mauGallery({
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

    // Validation du formulaire de contact
    $('form').on('submit', function(event) {
        var emailField = $('input[type="email"]');
        var email = emailField.val().trim();

        // Regex to check if the email contains a dot and the part after it
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            event.preventDefault(); // Empêcher l'envoi du formulaire
        }
    });
});
