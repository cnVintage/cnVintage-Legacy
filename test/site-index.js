'use strict';

let test = {
    name: 'Index render test.',
    entry: function(error, next) {
        let request = require('request');
        let config = require('../config');
        request.get({
            url: 'http://localhost:' + config.port
        }, (err) => {
            if (err) {
                error(err);
            }
            next();
        });
    },
};

module.exports = test;