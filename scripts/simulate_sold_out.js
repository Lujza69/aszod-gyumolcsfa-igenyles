
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:Kecskebab6000@db.lnrkonjehjsvtheafldi.supabase.co:5432/postgres';

async function simulateSoldOut() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to Supabase PostgreSQL');

        const sqlPath = path.join(__dirname, '../database/simulate_sold_out.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Simulating sold out state...');
        await client.query(sql);
        console.log('Database updated: All items set to 0 stock.');

    } catch (err) {
        console.error('Simulation failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

simulateSoldOut();
