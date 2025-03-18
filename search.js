import { websites } from './settings.js';
import { displayRandomQuote } from './quote.js';

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("title");
    const suggestionsList = document.getElementById("display");
    const quote = displayRandomQuote(); // Get the quote once when the page loads

    suggestionsList.innerHTML = quote;

    function showQuote() {
        document.getElementById("display").innerHTML = quote;
    }

    searchInput.addEventListener("keyup", function (event) {
        const query = searchInput.value.trim().toLowerCase();
        suggestionsList.innerHTML = '';

        if (query) {
            const filteredWebsites = Object.keys(websites).filter(website =>
                website.toLowerCase().startsWith(query)
            );

            const topSuggestions = filteredWebsites.slice(0, 3);

            topSuggestions.forEach(website => {
                const listItem = document.createElement('li');
                listItem.textContent = website;
                listItem.addEventListener('click', function () {
                    window.location.href = websites[website];
                });
                suggestionsList.appendChild(listItem);
            });

            if (event.key === "Enter" && topSuggestions.length > 0) {
                window.location.href = websites[topSuggestions[0]];
            }
        } else {
            showQuote();
            
            if (event.key === "Enter") {
                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
        }
    });

    // Handle blur event (when input loses focus)
    searchInput.addEventListener('blur', function () {
        setTimeout(function () {
            if (searchInput.value.trim() === "") {
                showQuote(); // Show the quote if the input is empty when losing focus
            }
        }, 200);
    });
});
