const http = require('http');
const path = require('path');
const { Pool } = require('pg');
const socketIo = require('socket.io'); // Přidáme socket.io
const session = require('express-session'); // Přidáme express-session pro správu session

const app = express();
const port = process.env.PORT || 10000; // Použijeme port z proměnné prostředí
const server = http.createServer(app); // Vytvoříme server
const io = socketIo(server); // Napojíme Socket.IO na server
// Konfigurace databázového poolu
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_url',
    password: 'Charalamba11@',
    port: 10000,
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
    secret: 'tajnyklic',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware pro zpracování JSON a URL encoded dat
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nastavení statických souborů
app.use(express.static(path.join(__dirname, 'public')));

// Různé stránky
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/registrace', (req, res) => res.sendFile(path.join(__dirname, 'registrace.html')));
app.get('/prihlaseni', (req, res) => res.sendFile(path.join(__dirname, 'prihlaseni.html')));
app.get('/profil', (req, res) => res.sendFile(path.join(__dirname, 'profil.html')));
app.get('/chat', (req, res) => res.sendFile(path.join(__dirname, 'chat.html')));
app.get('/koupit-mince', (req, res) => res.sendFile(path.join(__dirname, 'koupit mince.html')));
app.get('/komentare', (req, res) => res.sendFile(path.join(__dirname, 'komentare.html')));

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
    res.sendFile(path.join(__dirname, 'moderator.html'));
});

// Socket.io obsluha
io.on('connection', (socket) => {
    console.log('Uživatel připojen');
    
    socket.on('clientMessage', (message) => {
        console.log('Zpráva od klienta:', message);
        io.emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Uživatel odpojen');
    });
});

// Spuštění serveru
server.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});

