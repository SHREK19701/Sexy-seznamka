const { Client } = require('pg');

const client = new Client({
    user: 'pestgres',
    host: 'localhost',
    database: 'db_url',
    password: 'Charalamba11@',
    port: 5432,
});

// Funkce pro odeslání zprávy
async function sendMessage(sender, recipient, message) {
    await client.connect();
    try {
        const res = await client.query(`
            INSERT INTO messages (sender_username, recipient_username, message)
            VALUES ($1, $2, $3) RETURNING *
        `, [sender, recipient, message]);
        console.log('Zpráva byla odeslána:', res.rows[0]);
    } catch (err) {
        console.error('Chyba při odesílání zprávy:', err);
    } finally {
        await client.end();
    }
}

// Funkce pro načtení zpráv
async function getMessages(user1, user2) {
    await client.connect();
    try {
        const res = await client.query(`
            SELECT * FROM messages
            WHERE (sender_username = $1 AND recipient_username = $2) OR
                  (sender_username = $2 AND recipient_username = $1)
            ORDER BY timestamp ASC
        `, [user1, user2]);
        
        console.log('Zprávy mezi', user1, 'a', user2);
        res.rows.forEach(row => {
            console.log(`[${row.timestamp}] ${row.sender_username}: ${row.message}`);
        });
    } catch (err) {
        console.error('Chyba při načítání zpráv:', err);
    } finally {
        await client.end();
    }
}

// Příklad použití
sendMessage('uzivatel1', 'uzivatel2', 'Ahoj, jak se máš?');
getMessages('uzivatel1', 'uzivatel2');
