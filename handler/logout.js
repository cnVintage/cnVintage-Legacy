'use strict';

let db = require('../db');
let config = require('../config');
let request = require('request').defaults({jar: true});

let handler = (req, res) => {
    if (req.logined) {
        console.log('222');
        let token = req.cookies.access_token;
        let conn = db.getConn();
        conn.query({
            sql: [
                'DELETE FROM fl_access_tokens',
                'WHERE id=?'
            ].join(' '),
            values: [token],
        }, (err, table) => {
            res.clearCookie('access_token');
            res.redirect('/');
        })
    }
    else {
        res.redirect('/');
    }
};

module.exports = handler;
