/**
 * IE 4.0 does not support PNG files and those very large JPEG files.
 * Here we use graphicsmagick to convert any image file to JPEG with fixed width(640px).
 */

'use strict';

let config = require('../config');
let gm = require('gm');
let request = require('request');
let fs = require('fs');
let utils = require('../utils');

let handler = (req, res) => {
    // Fetch the url of image that we need to convert.
    let url = req.query.url;
    if (!url) {
        res.status(400);
        res.render('error', {code: 400, msg: 'Invalid access.'});
        return;
    }
    let fileName = url.substr(url.lastIndexOf('/') + 1);
    let hash = utils.md5(url);

    // Set correct header.
    res.set('Content-Type', 'image/jpeg');
    
    // Check cached file.
    fs.readFile(`${config.cache}/${hash}.cached`, (err, content) => {
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

                gm(body, fileName).size((err, size) => {
                    if (err) {
                        utils.log(err);
                        res.set('Content-Type', 'text/html');
                        res.status(500);
                        res.render('error', {code: 500, msg: 'Not a Image'});
                        return;
                    }
                    gm(body, fileName)
                        .background('#ffffff')
                        .resize(((size.width > 640) ? (640) : (size.width)), null)
                        .setFormat('jpg')
                        .toBuffer((err, buffer) => {
                            if (err) {
                                res.set('Content-Type', 'text/html');
                                res.status(500);
                                res.render('error', {code: 500, msg: err});
                                return;
                            }
                            res.send(buffer);
                            fs.writeFile(`${config.cache}/${hash}.cached`, buffer, () => {});
                        });
                });
            });
        }
        else {
            // Cache HIT! Just send it back.
            res.send(content);
        }
    });
};

module.exports = handler;
