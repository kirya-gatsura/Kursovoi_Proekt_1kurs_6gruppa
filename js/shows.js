// СКРИПТ ДЛЯ СТРАНИЦЫ АФИШИ
document.addEventListener('DOMContentLoaded', function() {
    
    const genreFilter = document.getElementById('genreFilter');
    const showsGrid = document.getElementById('showsGrid');
    
    if (genreFilter && showsGrid) {
        genreFilter.addEventListener('change', function() {
            filterShows();
        });
    }
    
    function filterShows() {
        const genre = genreFilter.value;
        
        const cards = showsGrid.querySelectorAll('.show-card');
        
        cards.forEach(function(card) {
            const tag = card.querySelector('.show-card-tag').textContent;
            let visible = true;
            
            if (genre !== 'all') {
                if (tag !== genre) {
                    visible = false;
                }
            }
            
            if (visible) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
});