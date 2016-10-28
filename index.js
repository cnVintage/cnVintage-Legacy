'use strict';

let express = require('express');
let config = require('./config');

let app = express();

// use pug to render html code.
app.set('view engine', 'pug');

// set up the route to the static files.
app.use('/static', express.static('./static'));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'cnVintage - 首页',
    tags: [
      {color: '#AAAAAA', name: '所有话题'},
      {color: '#003366', name: '机器展示'},
      {color: '#FF9900', name: '改装自制'},
      {color: '#009999', name: '新潮数码'},
      {color: '#99CC33', name: '一般讨论'},
    ],
    topics: [
      {
        title: 'Hello World',
        startUser: {
          avatarPath: '',
          name: 'SYSTEM',
        },
        lastUser: {
          avatarPath: '',
          name: 'SYSTEM',
        },
        lastDate: '1970-01-01',
        replyCnt: 3,
      }
    ],
  });
});

app.listen(config.port);
console.log(`[INFO] Server started on port ${config.port}.`);
