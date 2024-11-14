const express = require('express');
const http = require('http');
const path = require('path');
const { Pool } = require('pg');
const socketIo = require('socket.io'); // Přidáme socket.io
const session = require('express-session'); // Přidáme express-session pro správu session

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

// Konfigurace databázového poolu
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_url',
    password: 'Charalamba11@',
    port: 5432,
});

// Ověření připojení k databázi
pool.connect()
    .then(client => {
        console.log('Připojeno k databázi');
        client.release();
    })
    .catch(err => {
        console.error('Chyba při připojování k databázi:', err.stack);
    });

// Middleware pro session
app.use(session({
    secret: 'tajnyklic', // nahraďte vlastním tajným klíčem
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // secure: true použijte jen při HTTPS
}));

// Middleware pro zpracování JSON a URL encoded dat
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nastavení statických souborů
app.use(express.static(path.join(__dirname, 'public')));

// Hlavní stránka - index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Registrace
app.get('/registrace', (req, res) => {
    res.sendFile(path.join(__dirname, 'registrace.html'));
});

// Přihlášení
app.get('/prihlaseni', (req, res) => {
    res.sendFile(path.join(__dirname, 'prihlaseni.html'));
});

// Profil
app.get('/profil', (req, res) => {
    res.sendFile(path.join(__dirname, 'profil.html'));
});

// Chat
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

// Koupit mince
app.get('/koupit-mince', (req, res) => {
    res.sendFile(path.join(__dirname, 'koupit mince.html'));
});

// Komentáře
app.get('/komentare', (req, res) => {
    res.sendFile(path.join(__dirname, 'komentare.html'));
});

// Přihlašovací endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {
        req.session.role = 'moderator';
        return res.redirect('/moderator');
    }

    req.session.role = 'client';
    res.redirect('/client');
});

// Middleware pro ochranu stránky moderátora
function isModerator(req, res, next) {
    if (req.session.role === 'moderator') {
        return next();
    }
    res.redirect('/client');
}

// Route pro moderátora
app.get('/moderator', isModerator, (req, res) => {
    res.sendFile(path.join(__dirname, 'moderator.html')); // render změněno na sendFile
});

// Služba pro obsluhu klientů a moderátora
let clients = [];

io.on('connection', (socket) => {
    console.log('Uživatel připojen');
    clients.push(socket);

    socket.on('clientMessage', (message) => {
        console.log('Zpráva od klienta:', message);
        io.emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Uživatel odpojen');
        clients = clients.filter(client => client !== socket);
    });
});

// Spuštění serveru
server.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});

