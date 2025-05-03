// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', function(e) {
        // Check if Alt key is pressed
        if (!e.altKey) return;

        switch(e.key.toLowerCase()) {
            // Navigation shortcuts
            case 'h':
                window.location.href = 'index.html';
                break;
            case 'p':
                window.location.href = 'profile.html';
                break;
            case 'arrowup':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;

            default:
                break;
        }
    });
});
