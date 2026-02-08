
const { Client } = require('pg');

// Connection string used in previous scripts
const connectionString = 'postgresql://postgres:Kecskebab6000@db.lnrkonjehjsvtheafldi.supabase.co:5432/postgres';

const NAMES = {
    last: ['Kiss', 'Nagy', 'Kovács', 'Tóth', 'Szabó', 'Horváth', 'Varga', 'Molnár', 'Németh', 'Farkas'],
    first: ['János', 'István', 'László', 'Zoltán', 'András', 'Gábor', 'Péter', 'Attila', 'Tamás', 'József', 'Anna', 'Katalin', 'Mária', 'Erzsébet', 'Zsuzsanna', 'Judit', 'Ágnes', 'Andrea', 'Ildikó', 'Éva']
};

const STREETS = ['Kossuth Lajos u.', 'Szabadság tér', 'Petőfi Sándor u.', 'Baross Gábor u.', 'Dózsa György út', 'Falujárók útja', 'Pesti út', 'Hatvani út'];

const FRUITS = ['barack', 'szilva', 'korte']; // keys in inventory

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateUser(index) {
    const lastName = getRandomElement(NAMES.last);
    const firstName = getRandomElement(NAMES.first);
    const street = getRandomElement(STREETS);
    const houseNumber = Math.floor(Math.random() * 100) + 1;

    // Generate unique phone number based on index to avoid unique violation during test setup
    // Format: +36 30 111 0001 ...
    const phoneSuffix = (10000 + index).toString().substring(1);
    const phone = `+36 30 111 ${phoneSuffix}`;

    return {
        name: `${lastName} ${firstName}`,
        address: `${street} ${houseNumber}.`,
        phone: phone,
        fruit: getRandomElement(FRUITS),
        bulb: Math.random() > 0.3 // 70% chance to ask for bulb
    };
}

async function runLoadTest() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to Database. Starting Load Test (150 requests)...');

        const TOTAL_REQUESTS = 150;
        let successCount = 0;
        let failCount = 0;

        console.time('LoadTest');

        // Create an array of promises to simulate concurrency
        const promises = [];

        for (let i = 0; i < TOTAL_REQUESTS; i++) {
            const user = generateUser(i);

            // We call the RPC function `apply_request`
            // Signature: apply_request(p_name, p_address, p_phone, p_fruit, p_bulb)
            const query = `
        SELECT apply_request(
          $1::text, 
          $2::text, 
          $3::text, 
          $4::text, 
          $5::boolean
        ) as result;
      `;

            const values = [user.name, user.address, user.phone, user.fruit, user.bulb];

            const p = client.query(query, values)
                .then(res => {
                    const result = res.rows[0].result;
                    if (result.success) {
                        successCount++;
                        // Optional: minimal log to not flood console
                        // console.log(`[OK] ${user.name} - ${user.fruit}`);
                    } else {
                        failCount++;
                        console.log(`[FAIL] ${user.name} (${user.fruit}): ${result.message || result.error}`);
                    }
                })
                .catch(err => {
                    failCount++;
                    console.error(`[ERROR] System Error for ${user.name}:`, err.message);
                });

            promises.push(p);
        }

        await Promise.all(promises);

        console.timeEnd('LoadTest');
        console.log('-'.repeat(40));
        console.log(`Total Requests: ${TOTAL_REQUESTS}`);
        console.log(`Success: ${successCount} ✅`);
        console.log(`Failed: ${failCount} ❌ (Expect failures if stock ran out)`);
        console.log('-'.repeat(40));

    } catch (err) {
        console.error('Fatal error:', err);
    } finally {
        await client.end();
    }
}

runLoadTest();
