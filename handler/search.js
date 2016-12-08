'use strict';

let db = require('../db');
let config = require('../config');

let handler = (req, res) => {
    let partten = req.query.q.toLowerCase();

    // Storage the data that will be passed to the render engine.
    let data = {
        lang: config.lang,
        title: `${config.lang.searchResult}: ${req.query.q} - ${config.lang.siteTitle}`,
        keyWord: req.query.q
    };

    // Fetch the login status
    data.loginInfo = req.logined ? req.loginInfo : {};

    // Fetch all the tags' information from database.
    let conn = db.getConn();
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

        // Fetch all the posts as we will search among them.
        conn.query({
            sql: 'SELECT id, discussion_id, content FROM fl_posts WHERE fl_posts.hide_user_id IS NULL',
        }, (err, table) => {
            if (err) {
                res.render('error', {code: '500', msg: 'MySQL Error.'})
                return;
            }
            let filter = item => {
                return (item.content.toLowerCase().indexOf(partten) >= 0);
            }

            // Remove all the HTML markup.
            table = table.map(item => {
                item.content = item.content.replace(/<.+?>/g, (match) => {
                    return '';
                });
                return item;
            });

            // Use the filter defined above to test all elements in the array.
            let searchResult = table.filter(filter).map(item => {
                let begin = Math.max(item.content.toLowerCase().indexOf(partten) - 48, 0);
                return {
                    id: item.id,
                    discussion_id: item.discussion_id,
                    preview: item.content.substr(begin, 96).replace(new RegExp(partten, 'ig'), (match) => {
                        return `<span class="mark">${match}</span>`;
                    }),
                }
            });

            // A map of search result. `discussion id` -> `preview`
            let searchResultById = {};
            searchResult.forEach(item => {
                if (searchResultById[item.discussion_id]) {
                    searchResultById[item.discussion_id] += '<br />' + item.preview + '<br />...';
                }
                else {
                    searchResultById[item.discussion_id] = '...<br />' + item.preview + '<br />...';
                }
            })

            conn.query({
                sql: 'SELECT * FROM fl_discussions_tags;'
            }, (err, table) => {
                if (err) {
                    res.render('error', {code: '500', msg: 'MySQL Error.'})
                    return;
                }
                let tagMap = {};
                let getTagNameById = (id) => {
                    let result;
                    data.tags.forEach(tag => {
                        if (tag.id == id)
                            result = tag.name;
                    })
                    return result;
                }

                table.forEach(row => {
                    if (!tagMap[row.discussion_id]) {
                        tagMap[row.discussion_id] = [getTagNameById(row.tag_id)];
                    }
                    else {
                        tagMap[row.discussion_id].push(getTagNameById(row.tag_id));
                    }
                });
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
                        'WHERE fl_discussions.comments_count != 0',
                        'ORDER BY fl_discussions.last_time DESC'
                    ].join(' '),
                }, (err, table) => {
                    if (err) {
                        res.render('error', {code: '500', msg: 'MySQL Error.'})
                        return;
                    }
                    let filter = item => {
                        return item['title'].toLowerCase().indexOf(partten) >= 0 || searchResultById[item.id];
                    }

                    let filtered = table.filter(filter);

                    data.topics = filtered.map(item => {
                        return {
                            title: item['title'].replace(new RegExp(partten, 'ig'), (match) => {
                                return `<span class="mark">${match}</span>`;
                            }),
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
                            preview: searchResultById[item['id']] || '',
                            tagList: `[${tagMap[item['id']].join('|')}]`
                        };
                    });
                    
                    // Render the page and send to client.
                    res.render('search-result', data);
                });
            });
        });
    })
};

module.exports = handler;
