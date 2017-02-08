'use strict';

let db = require('../db');

let handler = (req, res) => {
    if (req.logined) {
        let token = req.cookies.access_token;
        let conn = db.getConn();
        conn.query({
            sql: [
                'DELETE FROM fl_access_tokens',
                'WHERE id=?'
            ].join(' '),
            values: [token],
        }, () => {
            res.clearCookie('access_token');
            res.redirect('/');
        });
    }
    else {
        res.redirect('/');
    }
};

module.exports = handler;
