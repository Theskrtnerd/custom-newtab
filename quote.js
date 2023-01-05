var quotes=["Be the best version of yourself", "By failing to prepare, you are preparing to fail", "Appear weak when you are strong, and strong when you are weak","Real living is living for others"]
var quote = quotes[Math.floor(Math.random()*quotes.length)];
document.getElementById("quote").innerHTML = quote;