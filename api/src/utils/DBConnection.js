const mariadb = require('mariadb');

let db_pool = null;

module.exports = {
    getDatabaseConnection: () => {
        console.log("here in mariadb")
        if (db_pool == null) {
            db_pool = mariadb.createPool({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                charset: process.env.DB_CHARSET
            });
        }

        return db_pool
    },
    query: (query, params) => {
        const pool = module.exports.getDatabaseConnection();
        return pool.query(query, params).catch(err => {
            console.log(err);
            throw err;
        });
    },
    close: () => {
        if (db_pool) {
            db_pool.end();
            db_pool = null;
        }
    }
}