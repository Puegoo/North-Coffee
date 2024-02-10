/**
 * Funkcja asynchroniczna pobierająca losowy obraz z serwisu Picsum.
 * @returns {Promise<string>} Obiekt Promise zawierający adres URL pobranego obrazu.
 *                           Jeśli wystąpi błąd, zwracane jest puste ciąg znaków.
 */
async function fetchRandomImage() {
    try {
        const response = await fetch('https://picsum.photos/50/50');
        const imageUrl = response.url;

        return imageUrl;
    } catch (error) {
        console.error('Błąd pobierania obrazu z API:', error);
        return ''; // Zwracane puste ciąg znaków w przypadku błędu.
    }
}

/**
 * Klasa reprezentująca wpis gościa w księdze gości.
 */
class GuestEntry {
    /**
     * Tworzy nowy wpis gościa.
     * @param {string} name - Imię gościa.
     * @param {string} message - Wiadomość wpisu.
     * @param {string} date - Data wpisu w formacie tekstowym.
     * @param {string} imageUrl - Adres URL obrazu dla wpisu.
     */
    constructor(name, message, date, imageUrl) {
        this.name = name;
        this.message = message;
        this.date = date;
        this.imageUrl = imageUrl;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Pobranie wpisów z lokalnego magazynu danych. Jeśli nie ma wpisów, utwórz pustą tablicę.
    const entries = JSON.parse(localStorage.getItem('guestBookEntries')) || [];

    /**
     * Dodaje nowy wpis do księgi gości.
     * @param {string} name - Imię gościa.
     * @param {string} message - Wiadomość wpisu.
     */
    function addEntry(name, message) {
        const date = new Date();
        fetchRandomImage().then(imageUrl => {
            const entry = new GuestEntry(name, message, date.toLocaleString(), imageUrl);
            entries.push(entry);
            updateGuestBook(); // Aktualizacja wyświetlenia księgi gości po dodaniu nowego wpisu.
            saveEntriesToLocalStorage(); // Zapis wpisów do lokalnego magazynu danych.
        });
    }

    /**
     * Aktualizuje wyświetlanie księgi gości na stronie.
     */
    function updateGuestBook() {
        const guestBookEntries = document.getElementById('guestBookEntries');
        guestBookEntries.innerHTML = '';

        // Iteracja przez wszystkie wpisy gości i utworzenie elementów HTML do wyświetlenia ich na stronie.
        entries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.innerHTML = `
                <img src="${entry.imageUrl}" alt="random image" width="50" height="50">
                <strong>${entry.name}</strong> (${entry.date}): ${entry.message}
            `;
            guestBookEntries.appendChild(entryElement);
        });
    }

    /**
     * Zapisuje wpisy do lokalnego magazynu danych.
     */
    function saveEntriesToLocalStorage() {
        localStorage.setItem('guestBookEntries', JSON.stringify(entries));
    }

    // Nasłuchiwanie zdarzenia submit formularza księgi gości.
    document.getElementById('guestBookForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('guestName').value;
        const message = document.getElementById('guestMessage').value;
        addEntry(name, message); // Dodanie nowego wpisu gościa po złożeniu formularza.
    });

    updateGuestBook(); // Wywołanie funkcji aktualizującej księgę gości na stronie po załadowaniu dokumentu.
});

