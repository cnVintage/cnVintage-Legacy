'use strict';

let express = require('express');
let config = require('./config');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// use pug to render html code.
app.set('view engine', 'pug');

// set up the route to the static files.
app.use('/static', express.static('./static'));
app.use('/assets', express.static(config.assetsPath));

// Make sure our content would be decoded correctly.
app.use((req, res, next) => {
    res.set('Content-Type', 'text/html; charset=UTF-8');
    next();
})

// Index page
app.get('/', require('./login-checker'));
app.get('/', require('./handler-index'));

// Discussion detail page.
app.get('/d/:id-:name', require('./login-checker'));
app.get('/d/:id-:name', require('./handler-discussion'));

// Tags view.
app.get('/t/:slug', require('./login-checker'));
app.get('/t/:slug', require('./handler-tags'));

// Login
app.get('/login', require('./handler-login').get);
app.post('/login', require('./handler-login').post);

// Logout
app.get('/logout', require('./login-checker'));
app.get('/logout', require('./handler-logout'));

// Reply & post.
app.post('/posts', require('./handler-post'));
app.post('/posts', require('./handler-post'));

// Image proxy
app.get('/imgProxy', require('./handler-image-proxy'));

// LaTeX to JPEG
app.get('/KaTeX/:expr', require('./handler-katex'));

 app.use(function(req, res) {
    res.status(404);
    res.render('error', { code: 404, msg: 'Page Not Found.'});
});

app.listen(config.port);
console.log(`[INFO] Server started on port ${config.port}.`);
