document.addEventListener('DOMContentLoaded', function() {
    // Fetch the previous scores from localStorage and display them
    let allResults = JSON.parse(localStorage.getItem('allResults')) || {};
    let scores = document.querySelector('.scores');

    function displayScores() {
        if (allResults.length === 0) {
            scores.innerHTML = '<p class="no-scores">No previous scores to display.</p>';
            return;
        }

        let table = `
        <div class="table-container">
            <table class="scores-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Deck Name</th>
                        <th>Correct</th>
                        <th>Wrong</th>
                        <th>Total</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let timestamp in allResults) {
            let result = allResults[timestamp];
            let percentage = ((result.correct / result.total) * 100).toFixed(2);
            
            table += `
                <tr>
                    <td>${result.date}</td>
                    <td>${result.deckName}</td>
                    <td>${result.correct}</td>
                    <td>${result.wrong}</td>
                    <td>${result.total}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        }

        table += `
                </tbody>
            </table>
        `;

        scores.innerHTML = table;
    }
    
    displayScores();
});