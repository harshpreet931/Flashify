document.getElementById('deckForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let deckInput = document.getElementById('deckInput').value;
    
    let decks = JSON.parse(localStorage.getItem('decks')) || [];
    decks.push(deckInput);
    localStorage.setItem('decks', JSON.stringify(decks));
    
    alert('Deck saved!');
    document.getElementById('deckInput').value = '';
});

// showing the currect deck in the div deckShow

let decks = JSON.parse(localStorage.getItem('decks')) || [];
let deckList = "<ul>";
decks.forEach(function(deck) {
    deckList += `<li>${deck}</li>`;
});
deckList += "</ul>";
document.getElementById('deckShow').innerHTML = deckList;