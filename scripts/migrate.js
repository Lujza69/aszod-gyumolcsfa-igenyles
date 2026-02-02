
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:Kecskebab6000@db.lnrkonjehjsvtheafldi.supabase.co:5432/postgres';

async function migrate() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to Supabase PostgreSQL');

        const sqlPath = path.join(__dirname, '../database/schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration...');
        // Split by statement if needed, but `client.query` can handle multiple statements usually if simple.
        // However, for safety with plpgsql functions, it's better to run as one block or minimal split.
        // pg driver supports multiple statements.

        await client.query(sql);

        console.log('Migration completed successfully!');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
