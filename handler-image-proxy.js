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
let sizeOf = require('image-size');

let handler = (req, res) => {
    // Fetch the url of image that we need to convert.
    let url = req.query.url;
    if (!url) {
        res.status(400);
        res.render('error', {code: 400, msg: 'Invalid access.'});
        return;
    }
    let fileName = url.substr(url.lastIndexOf('/') + 1);

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
                    res.set('Content-Type', 'text/html');
                    res.status(500);
                    res.render('error', {code: 500, msg: err});
                    return;
                }
                var dimension = sizeOf(body); // Get the image size.
                gm(body, fileName)
                    .background("#ffffff")
                    .resize(((dimension.width>640)?(640):(dimension.width)), null)
                    .setFormat('jpg')
                    .toBuffer((err, buffer) => {
                        if (err) {
                            res.set('Content-Type', 'text/html');
                            res.status(500);
                            res.render('error', {code: 500, msg: err});
                            return;
                        }
                        res.send(buffer);
                        fs.writeFile(`${config.cache}/${fileName}.cached`, buffer, () => {});
                    });
            });
        }
        else {
            // Cache HIT! Just send it back.
            res.send(content);
        }
    })
};

module.exports = handler;
