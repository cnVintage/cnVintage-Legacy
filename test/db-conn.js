'use strict';

let test = {
    name: 'Database connection test.',
    entry: function(error, next) {
        let db = require('../db');
        let conn = db.getConn();
        conn.query('select count(*) from fl_users', (err) => {
            if (err) {
                error(err);
            }
            next();
        });
    },
};

module.exports = test;