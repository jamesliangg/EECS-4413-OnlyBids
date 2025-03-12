const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = 'excellentPassword5';
    const hash = await bcrypt.hash(password, 10);
    console.log('Generated hash for seed data:', hash);
}

generateHash(); 