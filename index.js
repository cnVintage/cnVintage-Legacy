'use strict';

let express = require('express');
let config = require('./config');

let app = express();

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
app.get('/', require('./handler-index'));

// Image proxy
app.get('/imgProxy', require('./handler-image-proxy'));

// Discussion detail page.
app.get('/d/:id-:name', require('./handler-discussion'));

// Tags view.
app.get('/t/:slug', require('./handler-tags'));

// LaTeX to JPEG
app.get('/KaTeX/:expr', require('./handler-katex'));

app.use(function(req, res) {
    res.status(404);
    res.render('error', { code: 404, msg: 'Page Not Found.'});
});

app.listen(config.port);
console.log(`[INFO] Server started on port ${config.port}.`);
