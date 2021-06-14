const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'mydatabase',
        database: 'database_rh'
    }
});

module.exports = knex;
