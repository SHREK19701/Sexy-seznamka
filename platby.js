const { Client } = require('pg');
const axios = require('axios');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'db_url',
    password: 'Charalamba11@',
    port: 5432,
});

// Funkce pro provedení platby
async function processPayment(username, amount, paymentMethod) {
    await client.connect();
    try {
        // Zde bys provedl volání na platební bránu (např. PayPal, Stripe)
        // V tomto příkladu použijeme fiktivní API
        const paymentResponse = await axios.post('https://api.platebni-brana.com/payment', {
            username,
            amount,
            paymentMethod
        });

        // Zkontroluj, zda byla platba úspěšná
        if (paymentResponse.data.status === 'success') {
            // Zaznamenej platbu do databáze
            await client.query(`
                INSERT INTO payments (username, amount, payment_status, payment_method)
                VALUES ($1, $2, $3, $4)
            `, [username, amount, 'completed', paymentMethod]);
            console.log('Platba byla úspěšně provedena a zaznamenána do databáze.');
        } else {
            console.error('Platba se nezdařila:', paymentResponse.data.message);
        }
    } catch (err) {
        console.error('Chyba při zpracování platby:', err);
    } finally {
        await client.end();
    }
}

// Příklad použití
processPayment('uzivatel1', 1000, 'PayPal');
