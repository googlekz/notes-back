const Pool = require('pg').Pool;

exports.port = 5000;
exports.hostName = '127.0.0.1';
exports.pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'notes',
    password: '1234qwer',
    port: 5432,
})
