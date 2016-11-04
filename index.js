'use strict';

let express = require('express');
let iconv = require('iconv-lite');
let config = require('./config');

let app = express();

// use pug to render html code.
app.set('view engine', 'pug');

// set up the route to the static files.
app.use('/static', express.static('./static'));
app.use('/assets', express.static(config.assetsPath));

// Make sure our content will be decode correctly.
app.use((req, res, next) => {
    res.set('Content-Type', 'text/html; charset=UTF-8');
    next();
})

// Index page
app.get('/', require('./handler-index'));

// Image proxy: Convert any image to JPEG with width = 640
app.get('/imgProxy', require('./handler-image-proxy'));

// Discussions pages.
app.get('/d/:id-:name', require('./handler-discussion'));

app.listen(config.port);
console.log(`[INFO] Server started on port ${config.port}.`);
