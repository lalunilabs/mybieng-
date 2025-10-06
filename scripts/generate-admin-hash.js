const bcrypt = require('bcryptjs');

const password = 'MyBeing2024!Admin';
const hash = bcrypt.hashSync(password, 12);

console.log('Admin Password:', password);
console.log('Admin Hash:', hash);
console.log('\nAdd this to your .env.local file:');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
