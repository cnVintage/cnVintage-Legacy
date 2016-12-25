'use strict';

let db = require('../db');
let config = require('../config');

let handler = (req, res) => {
    let conn = db.getConn();
    let data = {
        lang: config.lang,
        discussion_id: req.params.id,
        url: req.url
    };

    // Fetch the login status
    data.loginInfo = req.logined ? req.loginInfo : {};

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
            'WHERE fl_discussions.id = ? AND fl_posts.hide_user_id IS NULL;',
        ].join(' '),
        values: [req.params.id]
    }, (err, table) => {
        if (err) {
            res.status(500);
            res.render('error', {code: '500', msg: 'MySQL Error.'})
            return;
        }
        if (table.length == 0) {
            res.status(404);
            res.render('error', {code: '404', msg: 'No Such Discussion.'})
            return;
        }
        // Reconstruct the structure of post list.
        data.posts = table.map(row => {
            return {
                userName: row.username,
                date: row.time.toLocaleDateString('zh-CN', {timeZone: 'Asia/Shanghai', hour12: false}) + ' ' 
                    + row.time.toLocaleTimeString('zh-CN', {timeZone: 'Asia/Shanghai', hour12: false}),
                content: row.content
                    .replace(/<[s|e]>([^]+?)<\/[s|e]>/g, () => '')
                    .replace(/<IMG ([^]+?)>([^]+?)<\/IMG>/g, (match, p1, p2) => `<img src="/imgProxy?url=${ encodeURIComponent(p1.match(/src="([^]+?)"/)[1]) }">`)
                    .replace(/<URL url="([^]+?)">([^]+?)<\/URL>/g, (match, p1, p2) => `<a href="${p1}">${p2}</a>`)
                    .replace(/<CODE>([^]+?)<\/CODE>/, (match, p1) => `<pre><code>${p1}</code></pre>`)
                    .replace(/<C>\$\$([^]+?)\$\$<\/C>/g, (match, expr) => `<img src="/KaTeX/${encodeURIComponent(expr)}"></img>`)
                    .replace(/<HR>([^]+?)<\/HR>/g, (match, p1) => `<hr />`)
                    .replace(/@(.+?)#\d+/, (match, p1) => `<font size="3" color="#337000">${config.lang.replyTo}${p1}:</font> `)
                    .replace(/<USERMENTION ([^]+?)>([^]+?)<\/USERMENTION>/, (match, p1, p2) => `<a href="/u/${ p1.match(/username="(.+?)"/)[1] }" class="mention">${ p2 }</a>`),
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
