const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Cesta pro statické soubory
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Hlavní stránka - index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Registrace
app.get('/registrace', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'registrace.html'));
});

// Prihlášení
app.get('/prihlaseni', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'prihlášení.html'));
});

// Profil
app.get('/profil', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'profil.html'));
});

// Chat
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'chat.html'));
});

// Koupit mince
app.get('/koupit-mince', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'koupit mince.html'));
});

// Komentáre
app.get('/komentare', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'komentáre.html'));
});

// Spuštení serveru
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

