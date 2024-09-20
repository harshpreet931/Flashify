// Initialize variables
let currentDeck = []; // Stores the current deck being created
let allDecks = JSON.parse(localStorage.getItem('allDecks')) || {}; // Retrieve all decks from local storage
let currentEditingDeck = ''; // Stores the name of the deck currently being edited


// Add event listener for form submission
document.getElementById('deckForm').addEventListener('submit', function(e) 
{
    e.preventDefault(); // Prevent the default form submission

    // Get the input values
    let deckInput = document.getElementById('deckInput').value; 
    let deckName = document.getElementById('deckName').value;

    // Check if a deck with the same name already exists
    if(allDecks.hasOwnProperty(deckName)) 
    {
        alert('A deck with that name already exists. Please choose a different name.');
        return;
    }
    
    // Validate the input
    if (validateInput(deckInput)) 
    {
        currentDeck.push(deckInput);
        updateDeckShow(); // Update the deck display
        clearForm(); // Clear the form
    }
    else 
    {
        alert('Invalid Format! Please use the given format.');
    }
});

// Function to validate the input
function validateInput(input) 
{
    let parts = input.trim().split('|');
    let options = parts[1].split(',');
    let correctAnswer = parts[2].trim();

    // Input must have 3 parts
    if(parts.length !== 3) return false;
    // Options must have at least 2 elements
    if(options.length < 2) return false;

    // Trim the options
    for(let i = 0; i < options.length; i++) options[i] = options[i].trim();

    // Correct answer must be one of the options
    if(options.indexOf(correctAnswer) === -1) 
    {
        alert('Correct answer must be one of the options.');
        return false;
    }

    return true;
}

// Function to clear the form 
function clearForm() 
{
    document.getElementById('deckInput').value = '';
}

// Function to update the display of the current deck
function updateDeckShow() 
{
    let deckShow = document.getElementById('deckShow');

    if (currentDeck.length === 0) 
    {
        deckShow.innerHTML = '<p class="empty-deck-message">Your current deck is empty.</p>';
    } 
    else 
    {
        let deckList = "<ul>";
        currentDeck.forEach(function(card, index) 
        {
            deckList += `<li>${card} <button onclick="removeCard(${index})">Remove</button></li>`;
        });
        deckList += "</ul>";
        deckShow.innerHTML = deckList;
    }
}

// Function to remove a card from the current deck
function removeCard(index) 
{
    // Remove One element from the currentDeck array at the given index
    currentDeck.splice(index, 1);

    // Update the deck display
    updateDeckShow();
}

// Add event listener for saving the deck
document.getElementById('saveDeck').addEventListener('click', function() 
{
    let deckName = document.getElementById('deckName').value;
    
    // Check if the deck name is not empty and the current deck is not empty
    if(deckName && currentDeck.length > 0) 
    {
        // Save the deck to the allDecks object
        allDecks[deckName] = currentDeck.slice();

        // Save the allDecks object to local storage
        localStorage.setItem('allDecks', JSON.stringify(allDecks));
        alert('Deck saved!');
        
        // Clear the current deck and the form
        currentDeck = [];
        document.getElementById('deckName').value = '';
        
        // Update the deck display and the deck grid
        updateDeckShow();
        updateAllDecks();
    }
    else 
    {
        alert('Please enter a deck name and at least one card!');
    }
});

// Function to update the deck grid
function updateAllDecks() 
{
    let decksGrid = document.getElementById('allDecks');
    
    if (Object.keys(allDecks).length === 0) 
    {
        decksGrid.innerHTML = '<p class="empty-deck-message">No decks available.</p>';
    } 
    else 
    {
        let decksHtml = "";
        for(let deckName in allDecks) 
        {
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

// Function to delete a deck
function deleteDeck(deckName) 
{
    if(confirm(`Are you sure you want to delete the deck "${deckName}"?`)) 
    {
        delete allDecks[deckName];
        localStorage.setItem('allDecks', JSON.stringify(allDecks));
        updateAllDecks();
    }
}

// Function to edit a deck
function editDeck(deckName) 
{
    currentEditingDeck = deckName;
    let modal = document.getElementById('editModal');
    let modalDeckName = document.getElementById('modalDeckName');
    let modalDeckContent = document.getElementById('modalDeckContent');
    
    modalDeckName.textContent = deckName;
    
    let cardList = "<ul>";
    allDecks[deckName].forEach((card, index) => 
    {
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

// Function to add a card to a deck
function removeCardFromDeck(deckName, index) 
{
    allDecks[deckName].splice(index, 1);
    localStorage.setItem('allDecks', JSON.stringify(allDecks));
    editDeck(deckName);  // Refresh the modal content
    updateAllDecks();  // Refresh the deck grid
}

// Function to add a card to a deck
function addCardToDeck(deckName) 
{
    let newCardInput = document.getElementById('newCardInput');
    let newCard = newCardInput.value.trim();

    if(validateInput(newCard)) 
    {
        allDecks[deckName].push(newCard);
        localStorage.setItem('allDecks', JSON.stringify(allDecks));
        newCardInput.value = '';
        editDeck(deckName);  // Refresh the modal content
        updateAllDecks();  // Refresh the deck grid
    }
    else 
    {
        alert('Invalid Format! Please use the given format.');
    }
}

// Close modal when clicking on <span> (x)
document.querySelector('.close').onclick = function() 
{
    document.getElementById('editModal').style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function(event) 
{
    let modal = document.getElementById('editModal');
    if (event.target == modal) 
    {
        modal.style.display = "none";
    }
}

updateDeckShow();
updateAllDecks();