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
    redis_port: 6379,
    redis_db: 0,
    redis_password: '',

    // mongodb 本地连接配置
    mongodb: 'mongodb://127.0.0.1/node_test',
    // mongodb 远程连接配置
    // mongodb: 'mongodb://username:password@42.96.192.98/ml-server',

    // 七牛相关配置
    qn_access_key: 'IX84TgLqFb35Sg9q3LhwV8lTfjuVhrP9J9J90BAq',
    qn_secret_key: 'mJQZRi3QaSZfpfl7aazU7iu12XNQ7t5V_UGdaSsY',
    qn_bucket_name: 'mlchat',

    // 系统错误
    error_server_db: 1001,

    // 应用级错误
    error_sign_already_exit: 2001,
    error_sign_sign_up_failed: 2002,
    error_sign_user_not_exit: 2003,
    error_sign_sign_in_failed: 2004,
    error_sign_invalid_password: 2005,
    error_sign_username_password_null: 2006

};

module.exports = config;