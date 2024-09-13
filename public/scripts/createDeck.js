let currentDeck = [];
let allDecks = JSON.parse(localStorage.getItem('allDecks')) || {};
let currentEditingDeck = '';

document.getElementById('deckForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let deckInput = document.getElementById('deckInput').value;
    
    if (deckInput.trim() !== '') {
        currentDeck.push(deckInput);
        updateDeckShow();
        clearForm();
    }
});

function clearForm() {
    document.getElementById('deckInput').value = '';
}

function updateDeckShow() {
    let deckList = "<ul>";
    currentDeck.forEach(function(card, index) {
        deckList += `<li>${card} <button onclick="removeCard(${index})">Remove</button></li>`;
    });
    deckList += "</ul>";
    document.getElementById('deckShow').innerHTML = deckList;
}

function removeCard(index) {
    currentDeck.splice(index, 1);
    updateDeckShow();
}

document.getElementById('saveDeck').addEventListener('click', function() {
    let deckName = document.getElementById('deckName').value;
    if(deckName && currentDeck.length > 0) {
        allDecks[deckName] = currentDeck.slice();
        localStorage.setItem('allDecks', JSON.stringify(allDecks));
        alert('Deck saved!');
        currentDeck = [];
        document.getElementById('deckName').value = '';
        updateDeckShow();
        updateAllDecks();
    }
    else {
        alert('Please enter a deck name and at least one card!');
    }
});

function updateAllDecks() {
    let decksGrid = "";
    for(let deckName in allDecks) {
        decksGrid += `
            <div class="deck-item">
                <h3>${deckName}</h3>
                <p>${allDecks[deckName].length} cards</p>
                <button onclick="editDeck('${deckName}')">Edit</button>
                <button onclick="deleteDeck('${deckName}')">Delete</button>
            </div>
        `;
    }
    document.getElementById('allDecks').innerHTML = decksGrid;
}

function deleteDeck(deckName) {
    if (confirm(`Are you sure you want to delete the deck "${deckName}"?`)) {
        delete allDecks[deckName];
        localStorage.setItem('allDecks', JSON.stringify(allDecks));
        updateAllDecks();
    }
}

function editDeck(deckName) {
    currentEditingDeck = deckName;
    let modal = document.getElementById('editModal');
    let modalDeckName = document.getElementById('modalDeckName');
    let modalDeckContent = document.getElementById('modalDeckContent');
    
    modalDeckName.textContent = deckName;
    
    let cardList = "<ul>";
    allDecks[deckName].forEach((card, index) => {
        cardList += `<li>${card} <button onclick="removeCardFromDeck('${deckName}', ${index})">Remove</button></li>`;
    });
    cardList += "</ul>";
    
    modalDeckContent.innerHTML = cardList;
    modal.style.display = "block";
}

function removeCardFromDeck(deckName, index) {
    allDecks[deckName].splice(index, 1);
    localStorage.setItem('allDecks', JSON.stringify(allDecks));
    editDeck(deckName);  // Refresh the modal content
    updateAllDecks();  // Refresh the deck grid
}

// Close modal when clicking on <span> (x)
document.querySelector('.close').onclick = function() {
    document.getElementById('editModal').style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    let modal = document.getElementById('editModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

updateAllDecks();