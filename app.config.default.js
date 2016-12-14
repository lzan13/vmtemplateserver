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
    mongodb: 'mongodb://127.0.0.1/test',
    /**
     * mongodb 远程连接配置，需要你的 mongodb 开启远程连接配置
     * mongodb://<username>:<password>@服务器 ip/dbame
     */
    // mongodb: 'mongodb://服务器 IP 地址:27017/test',

    /**
     * 七牛相关配置
     */
    qn_access_key: '改成你自己在七牛的 access key',
    qn_secret_key: '改成你自己在七牛的 secret key',
    qn_bucket_name: '改成你自己在七牛的 bucket name',

    /**
     * 请求返回状态结果
     */
    status_success: 'Success',

    /**
     * 客户端请求系统错误状态码
     */
    error_no: 0,
    error_db: 1001,

    /**
     * 客户端进行网络请求是应用级错误状态码
     */
    error_sign_already_exit: 2001,
    error_sign_sign_up_failed: 2002,
    error_sign_user_not_exit: 2003,
    error_sign_sign_in_failed: 2004,
    error_sign_invalid_password: 2005,
    error_sign_username_password_null: 2006

};

module.exports = config;