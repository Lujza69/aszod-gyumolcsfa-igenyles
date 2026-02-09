
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:Kecskebab6000@db.lnrkonjehjsvtheafldi.supabase.co:5432/postgres';

async function checkStock() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to Supabase PostgreSQL');

        const res = await client.query("SELECT id, remaining FROM inventory WHERE id = 'barack'");
        const barack = res.rows[0];

        console.log(`Current 'barack' stock: ${barack.remaining}`);

        if (barack.remaining > 60) {
            console.log('Stock seems to be UPDATED already (expecting ~70).');
        } else {
            console.log('Stock seems to be ORIGINAL (expecting ~50).');
        }

    } catch (err) {
        console.error('Check failed:', err.message);
    } finally {
        await client.end();
    }
}

checkStock();
