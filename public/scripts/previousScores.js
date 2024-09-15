document.addEventListener('DOMContentLoaded', function() {
    let allResults = JSON.parse(localStorage.getItem('allResults')) || {};
    let scores = document.querySelector('.scores');
    let clearBtn = document.getElementById('btn-clear');

    function displayScores() {
        if (Object.entries(allResults).length === 0) {
            scores.innerHTML = '<p class="no-scores">No previous scores to display.</p>';
            clearBtn.style.display = 'none';
        }
        else {
            clearBtn.style.display = 'block';
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

            // Convert object to array, sort in reverse order, and create table rows
            Object.entries(allResults)
                .sort((a, b) => b[0] - a[0])  // Sort by timestamp (key) in descending order
                .forEach(([timestamp, result]) => {
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
                });

            table += `
                    </tbody>
                </table>
            </div>
            `;

            scores.innerHTML = table;
        }
    }

    function clearScores() {
        allResults = {};
        localStorage.removeItem('allResults');
        displayScores();
    }

    clearBtn.addEventListener('click', clearScores);
    displayScores();
});