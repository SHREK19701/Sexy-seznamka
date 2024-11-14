const express = require('express');
const http = require('http');
const path = require('path'); // Zajistíme, e path je nactenı modul

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 10000;

// Konfigurace databázového poolu
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_url',
    password: 'Charalamba11@',
    port: 5432, // nebo váš vlastní port
});

// Overení pripojení k databázi
pool.connect()
    .then(client => {
        console.log('Pripojeno k databázi');
        client.release(); // Uvolníme klienta zpet do poolu
    })
    .catch(err => {
        console.error('Chyba pri pripojování k databázi:', err.stack);
    });

// Nastavení statickıch souboru
app.use(express.static(path.join(__dirname, 'public')));

// Hlavní stránka - index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Registrace
app.get('/registrace', (req, res) => {
    res.sendFile(path.join(__dirname, 'registrace.html'));
});

// Prihlášení
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

// Komentáre
app.get('/komentare', (req, res) => {
    res.sendFile(path.join(__dirname, 'komentare.html'));
});

// Spuštení serveru
server.listen(port, () => {
    console.log(`Server beí na http://localhost:${port}`);
});

// Prihlašovací endpoint
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
    res.render('moderator');
});

// Sluba pro obsluhu klientu a moderátora
let clients = [];

io.on('connection', (socket) => {
    console.log('A user connected');
    clients.push(socket);

    socket.on('clientMessage', (message) => {
        console.log('Message from client:', message);
        io.emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        clients = clients.filter(client => client !== socket);
    });
});

