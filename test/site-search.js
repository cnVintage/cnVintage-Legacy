'use strict';

let test = [{
    name: 'Search with valid keyword test.',
    entry: function(error, next) {
        let request = require('request');
        let config = require('../config');
        request.get({
            url: 'http://localhost:' + config.port + '/?q=IBM'
        }, (err, res, body) => {
            if (err) {
                error('Request error: ' + err);
            }
            if (res.statusCode === 200) {
                next();
            }
            else {
                error('Response error: Status code should be 200, but got a ' + res.statusCode);
            }
        })
    },
}, {
    name: 'Search with invalid empty keyword test.',
    entry: function(error, next) {
        let request = require('request');
        let config = require('../config');
        request.get({
            url: 'http://localhost:' + config.port + '/?q='
        }, (err, res, body) => {
            if (err) {
                error('Request error: ' + err);
            }
            if (res.statusCode === 200) {
                next();
            }
            else {
                error('Response error: Status code should be 200, but got a ' + res.statusCode);
            }
        })
    },
},
]

module.exports = test;