document.addEventListener('DOMContentLoaded', function() {
    let deckGrid = document.getElementById('deckGrid');
    let quizSetup = document.getElementById('quizSetup');
    let quizContainer = document.getElementById('quizContainer');
    let result = document.getElementById('result');
    let allDecks = JSON.parse(localStorage.getItem('allDecks')) || {};
    let currentDeck = [];
    let pageTitle = document.getElementById('pageTitle');
    let btnBack = document.getElementById('btn-back-a');
    let questionCountInput = document.getElementById('questionCount');
    let startQuizButton = document.getElementById('startQuiz');
    
    let progress = document.getElementById('progress');
    let divBtn = document.getElementsByClassName('btns-styled');
    let buttons = document.getElementsByClassName('btn-added');
    let correct = 0, wrong = 0;
    let questionCount = 10; // Default value
    let currentQuestionIndex = 0;

    fetch('/prebuilt_decks.json')
        .then(response => response.json())
        .then(prebuiltDecks => {
            let combinedDecks = {...prebuiltDecks, ...allDecks};

            if(Object.keys(combinedDecks).length === 0) {
                quizContainer.innerHTML = 'No decks to quiz, Add a deck to start.';
                return;
            }

            createDeckGrid(combinedDecks, prebuiltDecks);
        })
        .catch(error => {
            console.error('Error loading prebuilt decks:', error);
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
        deckPreview.addEventListener('click', () => showQuizSetup(deckName));
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

    function showQuizSetup(deckName) {
        deckGrid.style.display = 'none';
        quizSetup.style.display = 'block';
        pageTitle.style.display = 'none';
        startQuizButton.onclick = () => startQuiz(deckName);
    }

    function startQuiz(deckName) {
        questionCount = parseInt(questionCountInput.value);

        if (isNaN(questionCount) || questionCount < 1) {
            alert("Please enter a valid number of questions.");
            return;
        }
        
        // Fetch the deck from prebuilt decks or allDecks
        fetch('/prebuilt_decks.json')
            .then(response => response.json())
            .then(prebuiltDecks => {
                let fullDeck = deckName in prebuiltDecks ? [...prebuiltDecks[deckName]] : [...allDecks[deckName]];
                
                // Check if the number of questions exceeds the deck length
                if (questionCount > fullDeck.length) {
                    alert(`The number of questions exceeds the deck size. There are only ${fullDeck.length} questions available.`);
                    return;
                }
    
                // Proceed with the quiz if the question count is valid
                currentDeck = fullDeck.sort(() => 0.5 - Math.random()).slice(0, questionCount);
                correct = 0;
                wrong = 0;
                currentQuestionIndex = 0;
                quizSetup.style.display = 'none';
                quizContainer.style.display = 'block';
                btnBack.href = '/quiz';
    
                quizNext(deckName);
            })
            .catch(error => {
                console.error('Error loading prebuilt decks:', error);
                let fullDeck = [...allDecks[deckName]];
    
                // Check if the number of questions exceeds the deck length
                if (questionCount > fullDeck.length) {
                    alert(`The number of questions exceeds the deck size. There are only ${fullDeck.length} questions available.`);
                    return;
                }
    
                // Proceed with the quiz if the question count is valid
                currentDeck = fullDeck.sort(() => 0.5 - Math.random()).slice(0, questionCount);
                correct = 0;
                wrong = 0;
                currentQuestionIndex = 0;
                quizSetup.style.display = 'none';
                quizContainer.style.display = 'block';
                btnBack.href = '/quiz';
    
                quizNext(deckName);
            });
    }
    

    function quizNext(deckName) {
        if(currentQuestionIndex === questionCount) {
            quizContainer.innerHTML = '<h2>You have completed the quiz!</h2>';
            let quizResult = {
                total: questionCount,
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

        let card = currentDeck[currentQuestionIndex];
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

                progress.innerHTML = `Question ${currentQuestionIndex + 1}/${questionCount} | Correct: ${correct} | Wrong: ${wrong}`;

                currentQuestionIndex++;
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