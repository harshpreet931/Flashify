document.addEventListener('DOMContentLoaded', function() {
    let deckGrid = document.getElementById('deckGrid');
    let quizContainer = document.getElementById('quizContainer');
    let result = document.getElementById('result');
    let allDecks = JSON.parse(localStorage.getItem('allDecks')) || {};
    let currentDeck = [];
    
    // ----------------- for Styling and Progress -----------------
    let progress = document.getElementById('progress');
    let divBtn = document.getElementsByClassName('btns-styled');
    let buttons = document.getElementsByClassName('btn-added');
    let correct = 0, wrong = 0;

    if(decks.length === 0) {
        quizContainer.innerHTML = 'No decks to quiz, Add a deck to start.';
        return;
    }

    let visited = [];

    function quizNext() {
        if(visited.length === decks.length) {
            quizContainer.innerHTML = '<h2>You have completed the quiz!</h2>';
            return;
        }

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * decks.length);
        } while(visited.includes(randomIndex));

        let deck = decks[randomIndex];
        visited.push(randomIndex);

        let [term, options, answer] = deck.split('|');
        let optionsArray = options.split(',');

        quizContainer.innerHTML = `
            <h1>${term}</h1>
            <div class="btns-styled">${optionsArray.map(option => `<button class="btn-added">${option.trim()}</button>`).join('')}</div>
        `;

        let buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                if(this.textContent === answer.trim()) {
                    correct++;
                } else {
                    wrong++;
                }

                let progress = document.getElementById('progress');
                progress.innerHTML = `Correct: ${correct} | Wrong: ${wrong}`;

                setTimeout(() => {
                    result.innerHTML = '';
                    quizNext();
                }, 0);
            });
        });
    }

    quizNext();
    quizContainer.className = 'quiz-styled';
    divBtn.className = 'btns-styled';
    buttons.className = 'btn-added';
    progress.className = 'progress-styled';
});