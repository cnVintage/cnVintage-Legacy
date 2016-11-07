'use strict';

let db = require('./db');
let config = require('./config');
let gm = require('gm');

let handler = (req, res) => {
    let conn = db.getConn();
    let data = {
        lang: config.lang,
        title: 'cnVintage - 首页',
    };

    conn.query({
        sql: [
            'SELECT fl_posts.type, fl_posts.content, fl_posts.time, fl_posts.user_id,',
            '       fl_discussions.title,',
            '       fl_users.avatar_path, fl_users.username',
            'FROM fl_posts',
            'INNER JOIN fl_users',
            'ON fl_users.id = fl_posts.user_id',
            'INNER JOIN fl_discussions',
            'ON fl_discussions.id = discussion_id',
            'WHERE fl_discussions.id = ?;',
        ].join(' '),
        values: [req.params.id]
    }, (err, table) => {
        data.posts = table.map(row => {
            return {
                userName: row.username,
                date: row.time.toLocaleDateString() + ' ' + row.time.toLocaleTimeString(),
                content: row.content.replace(/<[s|e]>([^]+?)<\/[s|e]>/g, () => {
                    return '';
                }).replace(/<IMG ([^]+?)>([^]+?)<\/IMG>/g, (match, p1, p2) => {
                    let url = encodeURIComponent(p1.match(/src="([^]+?)"/)[1]);
                    return `<img src="/imgProxy?url=${ url }">`;
                }).replace(/<URL url="([^]+?)">([^]+?)<\/URL>/g, (match, p1, p2) => {
                    return `<a href="${p1}">${p2}</a>`
                }).replace(/<CODE>([^]+?)<\/CODE>/, (match, p1) => {
                    return `<pre><code>${p1}</code></pre>`
                }),
                avatarPath: '/assets/avatars/' + (row.avatar_path || 'default.jpg')
            }
        });
        data.title = table[0].title;
        res.render('discussion', data);
    })
};

module.exports = handler;
