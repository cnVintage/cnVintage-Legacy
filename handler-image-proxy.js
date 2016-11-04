'use strict';

let db = require('./db');
let config = require('./config');
let gm = require('gm');
let request = require('request');

let handler = (req, res) => {
    let url = req.query.url;
    if (!url) {
        res.send('400: Invalid access.');
        return;
    }
    
    // Set correct header.
    res.set('Content-Type', 'image/jpeg');
    
    request.get({
        url: url,
        encoding: null,
    }, (err, response, body) => {
        if (err) {
            return;
        }

        gm(body, url.substr(url.lastIndexOf('/') + 1))
            .background("#ffffff")
            .resize(640, null)
            .setFormat('jpg')
            .toBuffer((err, buffer) => {
                if (err) {
                    res.set('Content-Type', 'text/plain');
                    res.send('500: ' + err);
                    return;
                }
                res.send(buffer);
            });
    });
};

module.exports = handler;
