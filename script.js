let currentAudio = null;
const audioPlayer = document.getElementById('audio-player');
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.querySelector(`button[onclick="switchPage('${pageId}')"]`).classList.add('active');
}

function playAudio(button) {
    const book = button.closest('.book');
    const audioSrc = book.dataset.audio;
    if (currentAudio !== audioSrc) {
        audioPlayer.src = audioSrc;
        currentAudio = audioSrc;
    }
    audioPlayer.play();
}

function toggleFavorite(button) {
    const book = button.closest('.book');
    const bookTitle = book.querySelector('h3').textContent;
    const bookData = {
        title: bookTitle,
        description: book.querySelector('p').textContent,
        audio: book.dataset.audio,
        category: book.dataset.category
    };
    const index = favorites.findIndex(fav => fav.title === bookTitle);
    if (index === -1) {
        favorites.push(bookData);
        button.textContent = 'Remove from Favorites';
    } else {
        favorites.splice(index, 1);
        button.textContent = 'Add to Favorites';
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavorites();
}

function updateFavorites() {
    const favoritesContainer = document.getElementById('favorites');
    favoritesContainer.innerHTML = '';
    favorites.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.innerHTML = `
            <h3>${book.title}</h3>
            <p>${book.description}</p>
            <button onclick="playAudio(this)">Play</button>
            <button onclick="toggleFavorite(this)">Remove from Favorites</button>
        `;
        bookDiv.dataset.audio = book.audio;
        favoritesContainer.appendChild(bookDiv);
    });
}

function searchBooks() {
    const query = document.getElementById('search').value.toLowerCase();
    const books = document.querySelectorAll('#book-catalog .book');
    books.forEach(book => {
        const title = book.querySelector('h3').textContent.toLowerCase();
        book.style.display = title.includes(query) ? 'block' : 'none';
    });
}

function filterBooks() {
    const category = document.getElementById('category').value;
    const books = document.querySelectorAll('#book-catalog .book');
    books.forEach(book => {
        const bookCategory = book.dataset.category;
        book.style.display = (category === 'all' || bookCategory === category) ? 'block' : 'none';
    });
}

function updateProfilePic() {
    const file = document.getElementById('profile-upload').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-img').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Initialize favorites on page load
updateFavorites();