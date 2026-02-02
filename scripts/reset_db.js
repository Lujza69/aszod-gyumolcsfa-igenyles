
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:Kecskebab6000@db.lnrkonjehjsvtheafldi.supabase.co:5432/postgres';

async function resetDb() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to Supabase PostgreSQL');

        const sqlPath = path.join(__dirname, '../database/reset.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Resetting database...');
        await client.query(sql);
        console.log('Database reset successfully! All stocks restored.');

    } catch (err) {
        console.error('Reset failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

resetDb();
