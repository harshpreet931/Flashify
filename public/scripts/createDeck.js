let currentDeck = [];
let allDecks = JSON.parse(localStorage.getItem('allDecks')) || {};

document.getElementById('deckForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let deckInput = document.getElementById('deckInput').value;
    
    currentDeck.push(deckInput);
    
    updateDeckShow();
    clearForm();
});

function clearForm() {
    document.getElementById('deckInput').value = '';
}

function updateDeckShow() {
    let deckList = "<ul>";
    currentDeck.forEach(function(deck) {
        deckList += `<li>${deck}</li>`;
    });
    deckList += "</ul>";
    document.getElementById('deckShow').innerHTML = deckList;
}

document.getElementById('saveDeck').addEventListener('click', function() {
    let deckName = document.getElementById('deckName').value;
    if(deckName && currentDeck.length > 0) {
        allDecks[deckName] = currentDeck.slice();
        localStorage.setItem('allDecks', JSON.stringify(allDecks));
        alert('Deck saved!');
        currentDeck = [];
        updateDeckShow();
        updateAllDecks();
    }
    else {
        alert('Please enter a deck name and at least one card!');
    }
}) 

function updateAllDecks() {
    let decksList = "<ul>";
    for(let deckName in allDecks) {
        decksList += `<li onclick="editDeck('${deckName}')">${deckName} (${allDecks[deckName].length} cards)</li>`;
    }
    decksList += "</ul>";
    document.getElementById('allDecks').innerHTML = decksList;
}

function editDeck(deckName) {
    currentDeck = allDecks[deckName].slice();
    document.getElementById('deckName').value = deckName;
    updateDeckShow();
}

updateAllDecks();