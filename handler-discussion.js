'use strict';

let db = require('./db');
let config = require('./config');

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
                date: row.time,
                content: row.content.replace(/<s>([^]+?)<\/s>/g, () => {
                    return '';
                }),
                avatarPath: '/static/' + row.avatar_path
            }
        });
        data.title = table[0].title;
        res.render('discussion', data);
    })
};

module.exports = handler;
