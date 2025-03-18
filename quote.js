import { quotes } from './settings.js';

export function displayRandomQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById("display").innerHTML = quote;
    return quote;
}