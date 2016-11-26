'use strict';

let crypto = require('crypto');
let config = require('./config');

let randomString = (length) => {
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let res = '';
    for(let i = 0; i < length; i++)
        res += possible.charAt(Math.floor(Math.random() * possible.length));
    return res;
}
/*
let algorithm = config.cookieOption.algorithm;
let password = config.cookieOption.password || randomString(20);
*/
module.exports = {
    md5: function (content) {
        return require('crypto').createHash('md5').update(content, 'utf8').digest('hex');
    },/*
    encrypy: function (content) {
        let cipher = crypto.createCipher(algorithm, password)
        let crypted = cipher.update(content, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    },
    decrypt: function (content ) {
        let decipher = crypto.createDecipher(algorithm, password)
        let dec = decipher.update(content, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }*/
}