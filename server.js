// Import the Express framework
const express = require('express');

// Import the path module to work with file and directory paths
const path = require('path');

// Set the port for the server, using an environment variable if available or defaulting to 3000
const port = process.env.PORT || 3000;

// Create an instance of an Express app
const app = express();

// Serve static files from the 'public' directory (e.g., CSS, JS, images)
app.use(express.static(path.join(__dirname, './public')));

// Route for the root URL ('/'), sending 'index.html' as the response
app.get('/', (req, res) => 
{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for '/createDeck', serving 'createDeck.html' to allow deck creation
app.get('/createDeck', (req, res) => 
{
    res.sendFile(path.join(__dirname, 'public', 'createDeck.html'));
});

// Route for '/quiz', serving 'quiz.html' to allow users to take quizzes
app.get('/quiz', (req, res) => 
{
    res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});

// Route for '/previousScores', serving 'previousScores.html' to display past quiz scores
app.get('/previousScores', (req, res) => 
{
    res.sendFile(path.join(__dirname, 'public', 'previousScores.html'));
});

// Start the server and listen on the specified port
app.listen(port, () => 
{
    console.log(`Running at: ${port}`);
});
