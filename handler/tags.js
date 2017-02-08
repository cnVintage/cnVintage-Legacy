'use strict';

let db = require('../db');
let config = require('../config');

let handler = (req, res) => {
    // Storage the data that will be passed to the render engine.
    let data = {
        lang: config.lang,
    };

    // Fetch the login status
    data.loginInfo = req.logined ? req.loginInfo : {};

    // Fetch all the tags' information from database.
    let conn = db.getConn();
    conn.query({
        sql: 'SELECT name, color, id, slug FROM fl_tags'
    }, (err, table) => {
        if (err) {
            res.render('error', {code: '500', msg: 'MySQL Error.'});
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

        // Find tag id from tag's slug
        conn.query({
            sql: [
                'SELECT id, name',
                'FROM   fl_tags',
                'WHERE  fl_tags.slug = ?'
            ].join(' '),
            values: [req.params.slug],
        }, (err, table) => {
            if (err) {
                res.status(500);
                res.render('error', {code: '500', msg: 'MySQL Error.'});
                return;
            }
            if (!table[0]) {
                res.status(404);
                res.render('error', {code: '404', msg: 'No Such Tag.'});
                return;
            }
            let tagId = table[0].id;
            data.title = `${config.lang.tag}: ${table[0].name} - ${config.lang.siteTitle}`;
            // Fetch the discussions <-> tags table.
            conn.query({
                sql: 'SELECT * FROM fl_discussions_tags;'
            }, (err, table) => {
                if (err) {
                    res.render('error', {code: '500', msg: 'MySQL Error.'});
                    return;
                }
                let tagMap = {};
                let getTagNameById = (id) => {
                    let result;
                    data.tags.forEach(tag => {
                        if (tag.id == id)
                            result = tag.name;
                    });
                    return result;
                };

                table.forEach(row => {
                    if (!tagMap[row.discussion_id]) {
                        tagMap[row.discussion_id] = [getTagNameById(row.tag_id)];
                    }
                    else {
                        tagMap[row.discussion_id].push(getTagNameById(row.tag_id));
                    }
                });

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
                        'AND   fl_discussions.comments_count != 0',
                        'AND   fl_discussions.hide_time IS NULL',
                        'ORDER BY fl_discussions.last_time DESC'
                    ].join(' '),
                    values: [tagId],
                }, (err, table) => {
                    if (err) {
                        res.render('error', {code: '500', msg: 'MySQL Error.'});
                        return;
                    }
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
                            isSticky: item['is_sticky'],
                            tagList: `[${tagMap[item['id']].join('|')}]`
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

                    let currentPage = data.currentPage = req.query.page || 1; currentPage--;
                    data.maxPages = Math.floor(data.topics.length / config.postsPerPage) + 1;
                    data.topics = data.topics.slice(currentPage * config.postsPerPage, Math.min((currentPage + 1) * config.postsPerPage, data.topics.length));

                    // Render the page and send to client.
                    res.render('index', data);
                });
            });
        });
    });
};

module.exports = handler;
