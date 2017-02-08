'use strict';

let db = require('./db');
let utils = require('./utils');

let middleware = (req, res, next) => {
    // Check if cookie named access_token exist
    if (typeof req.cookies.access_token === 'undefined') {
        req.logined = false;
        next();
        return;
    }
    else {
        let conn = db.getConn();

        // Get more info about the access_token
        conn.query({
            sql: [
                'SELECT fl_access_tokens.id, fl_access_tokens.user_id, fl_access_tokens.last_activity,',
                '       fl_access_tokens.lifetime, fl_users.username, fl_users.avatar_path',
                'FROM   fl_access_tokens ',
                'INNER JOIN fl_users ',
                '        ON fl_users.id = user_id ',
                'WHERE fl_access_tokens.id = ?'
            ].join(' '),
            values: [req.cookies.access_token]
        }, (err, table) => {
            if (err) {
                res.render('error', {code: '500', msg: 'MySQL Error.'});
                utils.log(err);
                return;
            }
            if (table.length !== 1) {
                req.logined = false;
                next();
                return;
            }
            else {
                let tokenInfo = {
                    id: table[0].id,
                    userId: table[0].user_id,
                    userName: table[0].username,
                    lastActivity: table[0].last_activity,
                    lifetime: table[0].lifetime,
                    avatar: '/assets/avatars/' + (table[0].avatar_path || 'default.jpg'),
                };
                // Check if expired.
                if (Math.ceil(Date.now() / 1000) > tokenInfo.lifetime + tokenInfo.lastActivity) {
                    // Expired.
                    req.logined = false;
                    next();
                    return;
                }
                else {
                    // Seems that the token is valid. Let him pass.
                    req.logined = true;
                    req.loginInfo = {
                        username: tokenInfo.userName,
                        avatar: tokenInfo.avatar
                    };
                    next();
                }
            }
        });
    }
};

module.exports = middleware;