'use strict';

let db = require('./db');
let config = require('./config');

let handler = (req, res) => {
    let conn = db.getConn();
    let data = {
        lang: config.lang,
    };

    // Get all the posts under the discussion by discussion id.
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
        // Reconstruct the structure of post list.
        data.posts = table.map(row => {
            return {
                userName: row.username,
                date: row.time.toLocaleDateString('zh-CN', {timeZone: 'Asia/Shanghai', hour12: false}) + ' ' 
                    + row.time.toLocaleTimeString('zh-CN', {timeZone: 'Asia/Shanghai', hour12: false}),
                content: row.content.replace(/<[s|e]>([^]+?)<\/[s|e]>/g, () => {
                    return '';
                }).replace(/<IMG ([^]+?)>([^]+?)<\/IMG>/g, (match, p1, p2) => {
                    let url = encodeURIComponent(p1.match(/src="([^]+?)"/)[1]);
                    return `<img src="/imgProxy?url=${ url }">`;
                }).replace(/<URL url="([^]+?)">([^]+?)<\/URL>/g, (match, p1, p2) => {
                    return `<a href="${p1}">${p2}</a>`
                }).replace(/<CODE>([^]+?)<\/CODE>/, (match, p1) => {
                    return `<pre><code>${p1}</code></pre>`
                }).replace(/<C>\$\$([^]+?)\$\$<\/C>/g, (match, expr) => {
                    return `<img src="/KaTeX/${encodeURIComponent(expr)}"></img>`
                }).replace(/<HR>([^]+?)<\/HR>/g, (match, p1) => {
                    return `<hr />`
                }),
                avatarPath: '/assets/avatars/' + (row.avatar_path || 'default.jpg')
            }
        });

        // Update discussion title.
        data.title = table[0].title;

        // Render the page and send to client.
        res.render('discussion', data);
    })
};

module.exports = handler;
