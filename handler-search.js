'use strict';

let db = require('./db');
let config = require('./config');

let handler = (req, res) => {
    let partten = req.query.q.toLowerCase();

    // Storage the data that will be passed to the render engine.
    let data = {
        lang: config.lang,
        title: 'cnVintage - 首页',
        keyWord: req.query.q
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

        // Fetch all the posts as we will search among them.
        conn.query({
            sql: 'SELECT id, discussion_id, content FROM fl_posts'
        }, (err, table) => {
            let filter = item => {
                return (item.content.toLowerCase().indexOf(partten) >= 0);
            }

            let searchResult = table.filter(filter).map(item => {
                return {
                    id: item.id,
                    discussion_id: item.discussion_id,
                    preview: 'This is a preview.',
                }
            });

            let searchResultById = {};
            searchResult.forEach(item => {
                if (searchResultById[item.discussion_id]) {
                    searchResultById[item.discussion_id] += '...' + item.preview + '...';
                }
                else {
                    searchResultById[item.discussion_id] = '...' + item.preview;
                }
            })

            // Now we have all the discussion id which contain the key word.
            // Here we fetch all the discussions and filter them by `searchResultById` and their own title.
            conn.query({
                sql: [
                    'SELECT fl_discussions.id, fl_discussions.title, fl_discussions.slug,',
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
                    'ORDER BY fl_discussions.last_time DESC'
                ].join(' '),
            }, (err, table) => {
                let filter = item => {
                    return item['title'].toLowerCase().indexOf(partten) >= 0 || searchResultById[item.id];
                }

                let filtered = table.filter(filter);

                data.topics = filtered.map(item => {
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
                        preview: searchResultById[item['id']] || ''
                    };
                });

                // Deal with those posts that is sticky
                let sticky = [];
                for (let i = 0; i < data.topics.length; ++i) {
                    if (data.topics[i].isSticky) {
                        sticky.push(data.topics[i]);
                        data.topics.splice(i, 1);
                    }
                }

                data.topics = sticky.concat(data.topics);

                // Render the page and send to client.
                res.render('search-result', data);
            });
        });
    })
};

module.exports = handler;