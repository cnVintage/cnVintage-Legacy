'use strict';

let test = [{
    name: 'Tag view with valid tag test.',
    entry: function(error, next) {
        let request = require('request');
        let config = require('../config');
        request.get({
            url: 'http://localhost:' + config.port + '/t/show'
        }, (err) => {
            if (err) {
                error(err);
            }
            next();
        });
    },
}, {
    name: 'Tag view with invalid tag test.',
    entry: function(error, next) {
        let request = require('request');
        let config = require('../config');
        request.get({
            url: 'http://localhost:' + config.port + '/t/233'
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
},
];

module.exports = test;