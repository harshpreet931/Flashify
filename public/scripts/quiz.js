document.addEventListener('DOMContentLoaded', function() {
    let deckGrid = document.getElementById('deckGrid');
    let quizContainer = document.getElementById('quizContainer');
    let result = document.getElementById('result');
    let allDecks = JSON.parse(localStorage.getItem('allDecks')) || {};
    let currentDeck = [];
    let pageTitle = document.getElementById('pageTitle');
    let btnBack = document.getElementById('btn-back-a');
    
    // ----------------- for Styling and Progress -----------------
    let progress = document.getElementById('progress');
    let divBtn = document.getElementsByClassName('btns-styled');
    let buttons = document.getElementsByClassName('btn-added');
    let correct = 0, wrong = 0;

    // Load prebuilt decks from JSON file
    fetch('/prebuilt_decks.json')
        .then(response => response.json())
        .then(prebuiltDecks => {
            // Combine prebuilt and user decks
            let combinedDecks = {...prebuiltDecks, ...allDecks};

            if(Object.keys(combinedDecks).length === 0) {
                quizContainer.innerHTML = 'No decks to quiz, Add a deck to start.';
                return;
            }

            createDeckGrid(combinedDecks, prebuiltDecks);
        })
        .catch(error => {
            console.error('Error loading prebuilt decks:', error);
            // If there's an error, just use user decks
            createDeckGrid(allDecks, {});
        });

    function createDeckGrid(combinedDecks, prebuiltDecks) {
        for(let deckName in combinedDecks) {
            createDeckPreview(deckName, combinedDecks[deckName], deckName in prebuiltDecks);
        }
    }

    function createDeckPreview(deckName, deck, isPrebuilt) {
        let deckPreview = document.createElement('div');
        deckPreview.className = 'deck-preview' + (isPrebuilt ? ' prebuilt-deck' : '');
        deckPreview.innerHTML = `
            <div class="deck-title">${deckName} - ${deck.length}</div>
            <div class="deck-content">${getPreviewContent(deck)}</div>
        `;
        deckPreview.addEventListener('click', () => startQuiz(deckName));
        deckGrid.appendChild(deckPreview);
    }

    function getPreviewContent(deck) {
        let previewContent = '';
        deck.forEach(card => {
            let [term, options] = card.split('|');
            previewContent += `<div>${term} - ${options}</div>`;
        });
        return previewContent.length > 75 ? previewContent.substring(0, 75) + '...' : previewContent;
    }

    function startQuiz(deckName) {
        fetch('prebuilt_decks.json')
            .then(response => response.json())
            .then(prebuiltDecks => {
                currentDeck = deckName in prebuiltDecks ? [...prebuiltDecks[deckName]] : [...allDecks[deckName]];
                correct = 0;
                wrong = 0;
                deckGrid.style.display = 'none';
                quizContainer.style.display = 'block';
                pageTitle.style.display = 'none';
                btnBack.href = '/quiz';

                quizNext(deckName);
            })
            .catch(error => {
                console.error('Error loading prebuilt decks:', error);
                // If there's an error, assume it's a user deck
                currentDeck = [...allDecks[deckName]];
                correct = 0;
                wrong = 0;
                deckGrid.style.display = 'none';
                quizContainer.style.display = 'block';
                pageTitle.style.display = 'none';
                btnBack.href = '/quiz';

                quizNext(deckName);
            });
    }

    let visited = [];

    function quizNext(deckName) {
        if(visited.length === currentDeck.length) {
            quizContainer.innerHTML = '<h2>You have completed the quiz!</h2>';
            let quizResult = {
                total: currentDeck.length,
                correct: correct,
                wrong: wrong,
                date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
                deckName: deckName
            }
            let allResults = JSON.parse(localStorage.getItem('allResults')) || {};
            allResults[Date.now()] = quizResult;
            localStorage.setItem('allResults', JSON.stringify(allResults));
            return;
        }

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * currentDeck.length);
        } while(visited.includes(randomIndex));

        let card = currentDeck[randomIndex];
        visited.push(randomIndex);

        let [term, options, answer] = card.split('|');
        let optionsArray = options.split(',');

        quizContainer.innerHTML = `
            <h1>${term}</h1>
            <div class="btns-styled">${optionsArray.map(option => `<button class="btn-added">${option.trim()}</button>`).join('')}</div>
        `;

        let buttons = document.querySelectorAll('.btn-added');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                if(this.textContent === answer.trim()) {
                    correct++;
                } else {
                    wrong++;
                }

                progress.innerHTML = `Correct: ${correct} | Wrong: ${wrong}`;

                setTimeout(() => {
                    result.innerHTML = '';
                    quizNext(deckName);
                }, 0);
            });
        });
    }

    quizContainer.className = 'quiz-styled';
    divBtn.className = 'btns-styled';
    buttons.className = 'btn-added';
    progress.className = 'progress-styled';
});