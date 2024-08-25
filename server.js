const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/createDeck', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'createDeck.html'));
})

app.listen(port, () => {
    console.log(`Running at: ${port}`);
});