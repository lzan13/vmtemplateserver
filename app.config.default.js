/**
 * 项目配置文件
 */
var config = {
    // 项目名称
    app_name: 'ml-server',
    // 项目 logo
    app_logo: '/images/logo.svg',

    // 项目端口
    app_port: 5121,

    // 连接 redis 密匙
    session_secret: 'ml-secret-123',
    // 连接 redis 地址和端口
    redis_host: '127.0.0.1',
    redis_port: 6379

};

module.exports = config;