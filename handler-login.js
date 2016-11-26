'use strict';

let db = require('./db');
let config = require('./config');
let utils = require('./utils');
let request = require('request');

let getHandler = (req, res) => {
    res.render('login');
};

/**
 * With the help of Chrome DevTools, we can find how to get the access token with curl:
 * curl 'http://www.cnvintage.lo/login' \
 *  -H 'Content-Type: application/json; charset=UTF-8' \
 *  --data-binary '{"identification":"<USERNAME>","password":"<USERPASS>"}'
 */

let postHandler = (req, res) => {
    let server = {req, res};
    console.info('[INFO][POST-LOGIN] Login request received.');
    console.info('[INFO][POST-LOGIN] POST login info to ' + config.origUrl + '/login ... with data: ' +  JSON.stringify({
        identification: req.body.username,
        password: req.body.password
    }));
    request.post({
        url: `${config.origUrl}/login`,
        header: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        json: true,
        body: {
            identification: req.body.username,
            password: req.body.password
        }
    }, (err, res, body) => {
        console.info('[INFO][POST-LOGIN] Done, result is: ' + body);
        if (typeof body.errors === 'undefined') {
            server.res.cookie('access_token', body.token, {
                path: '/',
                httpOnly: true,
                expires: new Date(Date.now() + 2678400000)
            })
            server.res.redirect(301, '/');
        }
        else {
            server.res.render('login', {msg: '错误的用户名或密码'});
        }
    })
};

module.exports = {
    get: getHandler,
    post: postHandler,
};
