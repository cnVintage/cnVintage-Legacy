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

        // Find tag id from tag's slug
        conn.query({
            sql: [
                'SELECT id, name',
                'FROM   fl_tags',
                'WHERE  fl_tags.slug = ?'
            ].join(' '),
            values: [req.params.slug],
        }, (err, table) => {
            let tagId = table[0].id;
            data.title = `标签：${table[0].name} - cnVintage`;

            // Now is the content under the tag.
            conn.query({
                sql: [
                    'SELECT DISTINCT fl_discussions.id, fl_discussions.title, fl_discussions.slug,',
                    '       fl_discussions.comments_count, fl_discussions.last_time,',
                    '       fl_discussions.start_user_id, fl_discussions.last_user_id,',
                    '       fl_discussions.is_sticky,',
                    '       user1.avatar_path, user1.username as start_user_name,',
                    '       user2.username as last_user_name',
                    'FROM  fl_discussions',
                    'INNER JOIN fl_users user1',
                    '   ON user1.id = start_user_id',
                    'INNER JOIN fl_users user2',
                    '   ON user2.id = last_user_id',
                    'INNER JOIN fl_discussions_tags',
                    '   ON fl_discussions_tags.tag_id = ?',
                    'WHERE fl_discussions.id = fl_discussions_tags.discussion_id',
                    'ORDER BY fl_discussions.last_time DESC'
                ].join(' '),
                values: [tagId],
            }, (err, table) => {
                data.topics = table.map(item => {
                    return {
                        title: item['title'],
                        id: item['id'],
                        startUser: {
                            avatarPath: '/assets/avatars/' + (item['avatar_path'] || 'default.jpg'),
                            name: item['start_user_name'],
                        },
                        lastUser: {
                            name: item['last_user_name'],
                        },
                        lastDate: item['last_time'].toLocaleDateString('zh-CN', {timeZone: 'Asia/Shanghai', hour12: false}),
                        replyCnt: item['comments_count'] - 1,
                        href: `/d/${item['id']}-${item['slug']}`,
                        isSticky: item['is_sticky']
                    };
                }); 

                // Deal with sticky posts
                let sticky = [];
                for (let i = 0; i < data.topics.length; ++i) {
                    if (data.topics[i].isSticky) {
                        sticky.push(data.topics[i]);
                        data.topics.splice(i, 1);
                    }
                }

                data.topics = sticky.concat(data.topics);

                // Render the page and send to client.
                res.render('index', data);
            });
        });
    })
};

module.exports = handler;