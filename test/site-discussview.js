'use strict';
/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

let test = [{
    name: 'Discussion view with valid id and slug test.',
    entry: function(error, next) {
        let request = require('request');
        let config = require('../config');
        request.get({
            url: 'http://localhost:' + config.port + '/d/1-cnvintage-v0-1'
        }, (err, res) => {
            if (err) {
                error('Request error: ' + err);
            }
            if (res.statusCode === 200) {
                next();
            }
            else {
                error('Response error: Status code should be 200, but got a ' + res.statusCode);
            }
        });
    },
}, {
    name: 'Discussion view with invalid id test.',
    entry: function(error, next) {
        let request = require('request');
        let config = require('../config');
        request.get({
            url: 'http://localhost:' + config.port + '/d/233-666'
        }, (err, res) => {
            if (err) {
                error('Request error: ' + err);
            }
            if (res.statusCode === 404) {
                next();
            }
            else {
                error('Response error: Status code should be 404, but got a ' + res.statusCode);
            }
        });
    },
}];

module.exports = test;