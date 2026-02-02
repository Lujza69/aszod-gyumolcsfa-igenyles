
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:Kecskebab6000@db.lnrkonjehjsvtheafldi.supabase.co:5432/postgres';

async function applyPatch() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to Supabase PostgreSQL');

        const sqlPath = path.join(__dirname, '../database/patch_rpc.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Applying patch...');
        await client.query(sql);
        console.log('Patch applied successfully!');

    } catch (err) {
        console.error('Patch failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

applyPatch();
