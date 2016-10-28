'use strict';

let express = require('express');
let iconv = require('iconv-lite');
let config = require('./config');
let db = require('./db');

let app = express();

// use pug to render html code.
app.set('view engine', 'pug');

// set up the route to the static files.
app.use('/static', express.static('./static'));

// Make sure our content will be decode correctly.
app.use((req, res, next) => {
    res.set('Content-Type', 'text/html; charset=UTF-8');
    next();
})

// Index page
app.get('/', (req, res) => {
    // Storage the data that will be passed to the render engine.
    let data = {
        lang: config.lang,
        title: 'cnVintage - 首页',
    };

    // Fetch all the tags' information from database.
    let conn = db.getConn();
    conn.query({
        sql: 'SELECT name, color, id FROM fl_tags'
    }, (err, table) => {
        data.tags = table.map(item => {
            return {
                name: item.name,
                color: item.color,
                id: item.id,
            };
        });

        // Now is the content of index.
        conn.query({
            sql: [
                'SELECT fl_discussions.id, fl_discussions.title,',
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
                    startUser: {
                        avatarPath: 'static/' + item['avatar_path'],
                        name: item['start_user_name'],
                    },
                    lastUser: {
                        name: item['last_user_name'],
                    },
                    lastDate: item['last_time'].toLocaleDateString(),
                    replyCnt: item['comments_count'],
                };
            });

            // Render the page and send to client.
            res.render('index', data);
        });
    })
});

app.listen(config.port);
console.log(`[INFO] Server started on port ${config.port}.`);
