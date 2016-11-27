'use strict';

let test = [{
    name: 'Katex render with valid expression test.',
    entry: function(error, next) {
        let request = require('request');
        let config = require('../config');
        request.get({
            url: 'http://localhost:' + config.port + '/KaTeX/%20x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.' + Math.random()
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
    name: 'Katex render with invalid expression test.',
    entry: function(error, next) {
        let request = require('request');
        let config = require('../config');
        request.get({
            url: 'http://localhost:' + config.port + '/KaTeX/%5CLaTeX'
        }, (err, res, body) => {
            if (err) {
                error('Request error: ' + err);
            }
            if (res.statusCode === 500) {
                next();
            }
            else {
                error('Response error: Status code should be 500, but got a ' + res.statusCode);
            }
        })
    },
},
]

module.exports = test;