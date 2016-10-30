'use strict';

let db = require('./db');
let config = require('./config');

let handler = (req, res) => {
    // Storage the data that will be passed to the render engine.
    let data = {
        lang: config.lang,
        title: 'cnVintage - 首页',
    };

    // Fetch all the tags' information from database.
    let conn = db.getConn();
    conn.query({
        sql: 'SELECT name, color, id, slug FROM fl_tags'
    }, (err, table) => {
        data.tags = table.map(item => {
            return {
                name: item.name,
                color: item.color,
                id: item.id,
                href: '/t/' + item.slug,
            };
        });

        // Now is the content of index.
        conn.query({
            sql: [
                'SELECT fl_discussions.id, fl_discussions.title, fl_discussions.slug,',
                '       fl_discussions.comments_count, fl_discussions.last_time,',
                '       fl_discussions.start_user_id, fl_discussions.last_user_id,',
                '       user1.avatar_path, user1.username as start_user_name,',
                '       user2.username as last_user_name',
                'FROM  fl_discussions',
                'INNER JOIN fl_users user1',
                '   ON user1.id = start_user_id',
                'INNER JOIN fl_users user2',
                '   ON user2.id = last_user_id'
            ].join(' '),
        }, (err, table) => {
            data.topics = table.map(item => {
                return {
                    title: item['title'],
                    id: item['id'],
                    startUser: {
                        avatarPath: 'static/' + item['avatar_path'],
                        name: item['start_user_name'],
                    },
                    lastUser: {
                        name: item['last_user_name'],
                    },
                    lastDate: item['last_time'].toLocaleDateString(),
                    replyCnt: item['comments_count'],
                    href: `/d/${item['id']}-${item['slug']}`,
                };
            });

            // Render the page and send to client.
            res.render('index', data);
        });
    })
};

module.exports = handler;