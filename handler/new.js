'use strict';

let db = require('../db');
let config = require('../config');
let request = require('request').defaults({jar: true});

let getHandler = (req, res) => {
    if (!req.logined) {
        res.send('<html><body>You shall not create new discussion unless you are logined.</body></html>');
        return;
    }

    let conn = db.getConn();
    let data = {
        lang: config.lang,
        discussion_id: req.params.id,
        url: req.url,
        loginInfo: req.loginInfo
    };
    conn.query({
        sql: 'SELECT name, color, id, slug FROM fl_tags'
    }, (err, table) => {
        if (err) {
            res.render('error', {code: '500', msg: 'MySQL Error.'})
            return;
        }
        data.tags = table.map(item => {
            return {
                name: item.name,
                color: item.color,
                id: item.id,
                href: '/t/' + item.slug,
            };
        });
        res.render('new', data);
    });
}

let postHandler = (req, res) => {
    if (!req.logined) {
        res.send('<html><body>You shall not create new discussion unless you are logined.</body></html>');
        return;
    }

    let conn = db.getConn();
    let data = {
        lang: config.lang,
        discussion_id: req.params.id,
        url: req.url,
        loginInfo: req.loginInfo
    };

    conn.query({
        sql: 'SELECT name, color, id, slug FROM fl_tags'
    }, (err, table) => {
        if (err) {
            res.render('error', {code: '500', msg: 'MySQL Error.'})
            return;
        }

        data.tags = table.map(item => {
            return {
                name: item.name,
                color: item.color,
                id: item.id,
                href: '/t/' + item.slug,
            };
        });

        if (!req.body.title || !req.body.content) {
            data.title = req.body.title;
            data.content = req.body.content;
            data.errmsg = 'Title or content empty!';
            res.render('new', data);
            return;
        }

        let tagData = []
        data.tags.forEach(tag => {
            if (req.body[`tag-${tag.id}`]) {
                tagData.push({ type: 'tags', id: tag.id });
            }
        })
        if (tagData.length <= 0 || tagData.length >= 3) {
            data.title = req.body.title;
            data.content = req.body.content;
            data.errmsg = 'You could only pick one or two tags!';
            res.render('new', data);
            return;
        }

        let cookieJar = request.jar();
        cookieJar.setCookie(`flarum_remember=${req.cookies.access_token}`, config.origUrl);

        request.post({
            url: `${config.origUrl}/api/discussions`,
            header: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            json: true,
            body: {
                data: {
                    type: 'discussions',
                    attributes: {
                        title: req.body.title, content: req.body.content
                    },
                    relationships:{
                        tags: {
                            data: tagData
                        }
                    }
                }
            },
            jar: cookieJar
        }, (err, response, body) => {
            res.redirect(`/d/${body.data.id}-${body.data.attributes.title}`);
        })
    });
}

module.exports = {
    get: getHandler,
    post: postHandler
};