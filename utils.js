'use strict';
/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

let fs = require('fs');
let config = require('./config');

/*let randomString = (length) => {
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let res = '';
    for(let i = 0; i < length; i++)
        res += possible.charAt(Math.floor(Math.random() * possible.length));
    return res;
};*/

let log = (content) => {
    console.log(content);
    content += '\n';
    config.log && fs.appendFile(config.log, content, (err) => {
        if (err) {
            fs.writeFile(config.log, content, () => {});
        }
    });
};

let logTool = (req, res, next) => {
    let content = `[${new Date().toLocaleString()}] ${req.headers['x-real-ip'] || req.ip}: ${req.method} ${req.url}`;
    log(content);
    next();
};

let md5 = (content) => {
    return require('crypto').createHash('md5').update(content, 'utf8').digest('hex');
};

let dateFormatter = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    hour12: false
});
let timeFormatter = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    hour12: false,
    hour: 'numeric', minute: 'numeric', second: 'numeric'
});

let formatDate = (date) => {
    return dateFormatter.format(date);
};

let formatTime = (time) => {
    return timeFormatter.format(time);
};

module.exports = {
    md5, logTool, log, formatDate, formatTime
};