'use strict';

let mysql = require('mysql');

let conn = mysql.createConnection(require('./config').mysql);

let disconnectHandler = function() {
    conn.on('error', (err) => {
        if (!err.fatal) {
            return;
        }
        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            throw err;
        }
        conn.destroy();
        conn = mysql.createConnection(require('./config').mysql);
        disconnectHandler();
    });
}
disconnectHandler();

module.exports = {
    getConn: function() {
        return conn;
    }
}