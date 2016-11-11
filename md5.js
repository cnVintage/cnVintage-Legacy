'use strict';

module.exports = (str) => {
    return require('crypto').createHash('md5').update(str, 'utf8').digest('hex');
}