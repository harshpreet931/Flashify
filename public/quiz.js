document.addEventListener('DOMContentLoaded', function() {
    let quizContainer = document.getElementById('quizContainer');
    let result = document.getElementById('result');
    let decks = JSON.parse(localStorage.getItem('decks')) || [];

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
            ${optionsArray.map(option => `<button>${option.trim()}</button>`).join('')}
        `;

        // add event listener to the buttons
        let buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                if(this.textContent === answer.trim()) {
                    result.innerHTML = 'Correct Answer!';
                } else {
                    result.innerHTML = 'Wrong Answer!';
                }

                setTimeout(() => {
                    result.innerHTML = ''; // Clear the result after a short delay
                    quizNext(); // Move to the next question
                }, 1000);
            });
        });
    }

    quizNext(); // Start the quiz
});
