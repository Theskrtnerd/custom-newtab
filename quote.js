var quotes=["Be yourself; everyone else is already taken.", "So many books, so little time.", "A room without books is like a body without a soul."]
var quote = quotes[Math.floor(Math.random()*quotes.length)];
document.getElementById("quote").innerHTML = quote;