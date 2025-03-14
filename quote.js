var quotes=["Sông sâu tĩnh lặng, lúa chín cúi đầu", "It's amazing how quickly you can become world-class at something, simply because most people aren't trying that hard"]
var quote = quotes[Math.floor(Math.random()*quotes.length)];
document.getElementById("quote").innerHTML = quote;