const express = require('express');
const http = require('http');
const path = require('path'); // Zajist�me, �e path je nacten� modul

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 10000;

// Konfigurace datab�zov�ho poolu
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_url',
    password: 'Charalamba11@',
    port: 5432, // nebo v� vlastn� port
});

// Overen� pripojen� k datab�zi
pool.connect()
    .then(client => {
        console.log('Pripojeno k datab�zi');
        client.release(); // Uvoln�me klienta zpet do poolu
    })
    .catch(err => {
        console.error('Chyba pri pripojov�n� k datab�zi:', err.stack);
    });

// Nastaven� statick�ch souboru
app.use(express.static(path.join(__dirname, 'public')));

// Hlavn� str�nka - index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Registrace
app.get('/registrace', (req, res) => {
    res.sendFile(path.join(__dirname, 'registrace.html'));
});

// Prihl�en�
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

// Koment�re
app.get('/komentare', (req, res) => {
    res.sendFile(path.join(__dirname, 'komentare.html'));
});

// Spu�ten� serveru
server.listen(port, () => {
    console.log(`Server be�� na http://localhost:${port}`);
});

// Prihla�ovac� endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {
        req.session.role = 'moderator';
        return res.redirect('/moderator');
    }

    req.session.role = 'client';
    res.redirect('/client');
});

// Middleware pro ochranu str�nky moder�tora
function isModerator(req, res, next) {
    if (req.session.role === 'moderator') {
        return next();
    }
    res.redirect('/client');
}

// Route pro moder�tora
app.get('/moderator', isModerator, (req, res) => {
    res.render('moderator');
});

// Slu�ba pro obsluhu klientu a moder�tora
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

