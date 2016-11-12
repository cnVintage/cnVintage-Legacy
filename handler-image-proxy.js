/**
 * IE 4.0 does not support PNG files and those very large JPEG files.
 * Here we use graphicsmagick to convert any image file to JPEG with fixed width(640px).
 */

'use strict';

let db = require('./db');
let config = require('./config');
let gm = require('gm');
let request = require('request');
let fs = require('fs');

let handler = (req, res) => {
    // Fetch the url of image that we need to convert.
    let url = req.query.url;
    let fileName = url.substr(url.lastIndexOf('/') + 1);
    if (!url) {
        res.send('400: Invalid access.');
        return;
    }

    // Set correct header.
    res.set('Content-Type', 'image/jpeg');
    
    // Check cached file.
    fs.readFile(`${config.cache}/${fileName}.cached`, (err, content) => {
        if (err) {  // Not found.
            // Get the buffer of image.
            request.get({
                url: url,
                encoding: null,     // Make sure body is buffer but not string.
            }, (err, response, body) => {
                if (err) {
                    res.set('Content-Type', 'text/plain');
                    res.send('500: ' + err);
                    return;
                }

                gm(body, fileName)
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
                        fs.writeFile(`${config.cache}/${fileName}.cached`, buffer, () => {});
                    });
            });
        }
        else {
            // Catch HIT! Just send it back.
            res.send(content);
        }
    })
};

module.exports = handler;
