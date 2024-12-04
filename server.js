const http = require('http');
const path = require('path');
const { Pool } = require('pg');
const socketIo = require('socket.io');
const session = require('express-session');
const express = require('express');
const app = express();

// Nastavení serveru
const server = app.listen(10000, () => {
    console.log('Server běží na portu 10000');
});

// Inicializace Socket.IO
const io = socketIo(server);

// Připojení k databázi
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'localStorage',
    password: 'Charalamba11@',
    port: 5432,
});

pool.connect()
    .then(client => {
        console.log('Připojeno k databázi');
        client.release();
    })
    .catch(err => {
        console.error('Chyba při připojení k databázi:', err.stack);
    });

// Middleware
app.use(session({
    secret: 'tajnyklic',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Nastav na true pro produkci
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Složka pro statické soubory

// Socket.IO události
io.on('connection', (socket) => {
    console.log('Uživatel připojen!');
    socket.on('chatMessage', (msg) => {
        console.log(`Zpráva: ${msg}`);
        io.emit('chatMessage', msg); // Zasílání zpráv všem uživatelům
    });
});

// Stránky a routy
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/registrace', (req, res) => res.sendFile(path.join(__dirname, 'public', 'registrace.html')));
app.get('/prihlaseni', (req, res) => res.sendFile(path.join(__dirname, 'public', 'prihlaseni.html')));
app.get('/profil', (req, res) => res.sendFile(path.join(__dirname, 'public', 'profil.html')));
app.get('/chat', (req, res) => res.sendFile(path.join(__dirname, 'public', 'chat.html')));
app.get('/koupit-mince', (req, res) => res.sendFile(path.join(__dirname, 'public', 'koupit-mince.html')));
app.get('/komentare', (req, res) => res.sendFile(path.join(__dirname, 'public', 'komentare.html')));

// Přihlášení
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {
        req.session.role = 'moderator';
        return res.redirect('/moderator');
    }

    req.session.role = 'client';
    res.redirect('/client');
});

// Role-based routy
app.get('/moderator', (req, res) => {
    if (req.session.role === 'moderator') {
        res.send('Vítejte, moderátore!');
    } else {
        res.status(403).send('Nemáte přístup.');
    }
});

app.get('/client', (req, res) => {
    if (req.session.role === 'client') {
        res.send('Vítejte, kliente!');
    } else {
        res.status(403).send('Nemáte přístup.');
    }
});

