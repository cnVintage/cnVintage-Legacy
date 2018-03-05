'use strict';

let express = require('express');
let config = require('./config');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let db = require('./db');
let utils = require('./utils');

let app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// disable 'x-powered-by' for security
app.disable('x-powered-by');

// use pug to render html code.
app.set('view engine', 'pug');

// set up the route to the static files.
app.use('/static', express.static('./static'));
app.use('/assets', express.static(config.assetsPath));

// Log all activity to file.
app.use(utils.logTool);

// Make sure our content would be decoded correctly.
app.use((req, res, next) => {
    res.set('Content-Type', 'text/html; charset=UTF-8');
    next();
});

// Image proxy
app.get('/imgProxy', require('./handler/image-proxy'));

// LaTeX to JPEG
app.get('/KaTeX/:expr', require('./handler/katex'));

// Check if MySQL connection is alive
app.use((req, res, next) => {
    db.getConn().query('SELECT version()', (err) => {
        if (err) {
            // YOU DIED
            // recreate a new one
            db.recreateConn();
        }
        next();
    });
});

// Verify cookie in order to get the logined user's info.
app.use(require('./login-checker'));

// Index page
app.get('/', require('./handler/index'));

// Discussion detail page.
app.get('/d/:id-:name', require('./handler/discussion'));

// Tags view.
app.get('/t/:slug', require('./handler/tags'));

// Login
app.get('/login', require('./handler/login').get);
app.post('/login', require('./handler/login').post);

// Logout
app.get('/logout', require('./handler/logout'));

// Reply & post.
app.post('/posts', require('./handler/post'));
app.post('/posts', require('./handler/post'));

// New discussion
app.get('/new', require('./handler/new').get);
app.post('/new', require('./handler/new').post);

app.use(function(req, res) {
    res.status(404);
    res.render('error', { code: 404, msg: 'Page Not Found.'});
});

app.listen(config.port);
utils.log(`[INFO] Server started on port ${config.port}.`);
