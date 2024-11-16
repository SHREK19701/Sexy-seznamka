const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'db_url',
    password: 'Charalamba11@',
    port: 5432,
});

// Funkce pro přidání mincí
async function addCoins(username, amount) {
    await client.connect();
    try {
   

        // Přidej mince
        await client.query('UPDATE user_coins SET coins = coins + $1 WHERE username = $2', [amount, username]);
        console.log(`${amount} mincí bylo přidáno uživateli ${username}.`);
    } catch (err) {
        console.error('Chyba při přidávání mincí:', err);
    } finally {
        await client.end();
    }
}

// Funkce pro odebrání mincí
async function removeCoins(username, amount) {
    await client.connect();
    try {
        const resUser = await client.query('SELECT * FROM user_coins WHERE username = $1', [username]);
        
        if (resUser.rows.length === 0) {
            console.error('Uživatel neexistuje.');
            return;
        }

        // Zkontroluj, zda má dostatek mincí
        const currentCoins = resUser.rows[0].coins;
        if (currentCoins < amount) {
            console.error('Nedostatek mincí na účtu.');
            return;
        }

        // Odeber mince
        await client.query('UPDATE user_coins SET coins = coins - $1 WHERE username = $2', [amount, username]);
        console.log(`${amount} mincí bylo odebráno uživateli ${username}.`);
    } catch (err) {
        console.error('Chyba při odebírání mincí:', err);
    } finally {
        await client.end();
    }
}

// Funkce pro zobrazení mincí uživatele
async function getUserCoins(username) {
    await client.connect();
    try {
        const res = await client.query('SELECT * FROM user_coins WHERE username = $1', [username]);
        
        if (res.rows.length === 0) {
            console.error('Uživatel neexistuje.');
            return;
        }

        console.log(`Uživatel ${username} má ${res.rows[0].coins} mincí.`);
    } catch (err) {
        console.error('Chyba při načítání mincí:', err);
    } finally {
        await client.end();
    }
}

// Příklad použití
addCoins('uzivatel1', 1000);
removeCoins('uzivatel1', 500);
getUserCoins('uzivatel1');
