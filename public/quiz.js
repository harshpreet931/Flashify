document.addEventListener('DOMContentLoaded', function() {
    let quizContainer = document.getElementById('quizContainer');
    let decks = JSON.parse(localStorage.getItem('decks')) || [];

    if(decks.length === 0) {
        quizContainer.innerHTML = 'No decks to quiz, Add a deck to start.';
        return;
    }

    decks.forEach(deck => {
        let [term, options, answer] = deck.split('|').map(s=>s.trim());
        let optionsArray = options.split(',').map(s=>s.trim());

        let quizItem = document.createElement('div');
        quizItem.innerHTML = `
            <p>${term}</p>
            ${optionsArray.map(option => `<button>${option}</button>`).join('')}
        `;
        quizContainer.appendChild(quizItem);
        quizItem.addEventListener('click', function(e) {
            if(e.target.classList.contains('option')) {
                let isCorrect = e.target.testContent.trim() === answer;
                alert(isCorrect ? 'Correct!' : 'Incorrect!');
            }
        })
    })
})