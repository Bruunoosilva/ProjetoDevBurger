document.addEventListener('DOMContentLoaded', function() {
    const searchForms = document.querySelectorAll('.search-form');
    
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('.search-input').value.toLowerCase();
            
            if (searchTerm) {
                alert(`Buscando por: ${searchTerm}`);
            }
        });
    });
});
