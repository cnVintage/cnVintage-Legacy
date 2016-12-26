'use strict';

let db = require('../db');
let config = require('../config');
let request = require('request').defaults({jar: true});

let handler = (req, res) => {
    let data = {
        data: {
            type: 'posts',
            attributes: {
                content: req.body.content
            },
            relationships: {
                discussion: {
                    data: {
                        type: "discussions",
                        id: req.body.discussion_id
                    }
                }
            }
        }
    }
    let cookieJar = request.jar();
    cookieJar.setCookie(`flarum_remember=${req.cookies.access_token}`, config.origUrl);

    request.post({
        url: `${config.origUrl}/api/posts`,
        header: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        json: true,
        body: data,
        jar: cookieJar
    }, (err, response, body) => {
        res.redirect(req.query.redirect || '/');
    })
};

module.exports = handler;
