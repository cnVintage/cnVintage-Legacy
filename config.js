'use strict';

let config = {
    port: 8080,
    mysql: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'forum',
    },
    lang: {
        newTopic: '新的话题',
        lastReply: ' 最后回复于 ',
        daysBefore: ' 天前',
        legacy: '简易版',          // 雾
        search: '搜索',
        signin: '登陆',
        signup: '注册',
    }
}

module.exports = config;
