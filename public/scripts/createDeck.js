let currentDeck = [];
let allDecks = JSON.parse(localStorage.getItem('allDecks')) || {};
let currentEditingDeck = '';

document.getElementById('deckForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let deckInput = document.getElementById('deckInput').value;
    let deckName = document.getElementById('deckName').value;

    if(allDecks.hasOwnProperty(deckName)) {
        alert('A deck with that name already exists. Please choose a different name.');
        return;
    }
    
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
    let deckShow = document.getElementById('deckShow');
    if (currentDeck.length === 0) {
        deckShow.innerHTML = '<p class="empty-deck-message">Your current deck is empty.</p>';
    } else {
        let deckList = "<ul>";
        currentDeck.forEach(function(card, index) {
            deckList += `<li>${card} <button onclick="removeCard(${index})">Remove</button></li>`;
        });
        deckList += "</ul>";
        deckShow.innerHTML = deckList;
    }
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
    let decksGrid = document.getElementById('allDecks');
    if (Object.keys(allDecks).length === 0) {
        decksGrid.innerHTML = '<p class="empty-deck-message">No decks available.</p>';
    } else {
        let decksHtml = "";
        for(let deckName in allDecks) {
            decksHtml += `
                <div class="deck-item">
                    <h3>${deckName}</h3>
                    <p>${allDecks[deckName].length} cards</p>
                    <button onclick="editDeck('${deckName}')">Edit</button>
                    <button onclick="deleteDeck('${deckName}')">Delete</button>
                </div>
            `;
        }
        decksGrid.innerHTML = decksHtml;
    }
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
        cardList += `<li>${card} <button onclick="removeCardFromDeck('${deckName}', ${index})" class="remove-button">Remove</button></li>`;
    });
    cardList += "</ul>";

    cardList += `
        <div>
            <input type="text" id="newCardInput" placeholder="Enter New Card">
            <button onclick="addCardToDeck('${deckName}')" class="add-button">Add Card</button>
         </div>
    `
    
    modalDeckContent.innerHTML = cardList;
    modal.style.display = "block";
}

function removeCardFromDeck(deckName, index) {
    allDecks[deckName].splice(index, 1);
    localStorage.setItem('allDecks', JSON.stringify(allDecks));
    editDeck(deckName);  // Refresh the modal content
    updateAllDecks();  // Refresh the deck grid
}

function addCardToDeck(deckName) {
    let newCardInput = document.getElementById('newCardInput');
    let newCard = newCardInput.value.trim();

    if(newCard !== '') {
        allDecks[deckName].push(newCard);
        localStorage.setItem('allDecks', JSON.stringify(allDecks));
        newCardInput.value = '';
        editDeck(deckName);  // Refresh the modal content
        updateAllDecks();  // Refresh the deck grid
    }
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

updateDeckShow();
updateAllDecks();