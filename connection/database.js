const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'mydatabase',
        database: 'database_rh'
    }
});

module.exports = knex;