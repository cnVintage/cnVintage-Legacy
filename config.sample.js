'use strict';

let config = {
    port: 8080,
    assetsPath: '/var/www/html/assets/',
    cache: '/tmp/',
    origUrl: 'http://www.cnvintage.lo',
    postsPerPage: 10,
    mysql: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'forum',
    },
    lang: {
        lastReply: ' 最后回复于 ',
        legacy: '简易版',          // 雾
        search: '搜索',
        signin: '登陆',
        signup: '注册',
        index: '首页',
        searchResult: '搜索结果',
        siteTitle: 'cnVintage',
        tag: '标签',
        logout: '注销',
        reply: '回复',
        replyTo: '回复给',
        newDiscussion: '新的话题',
        discussionTitle: '标题',
        discussionContent: '内容',
        publish: '发布',
        emptyset: '没听过这个说法',
    }
};

module.exports = config;
