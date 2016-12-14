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
     * 定义项目错误码以及错误描述
     * 系统状态码
     */
    code: {
        normal: 0,
        db_exception: 1001,
        user_already_exist: 2001,
        user_not_exist: 2002,
        sign_up_failed: 2003,
        sign_in_failed: 2004,
        invalid_password: 2005,
        params_empty: 2006
    },

    /**
     * 定义常用字符串
     */
    msg: {
        undefined: 'undefined',
        msg_success: 'success',
        // 状态描述
        db_exception: 'Service db exception',
        user_already_exist: 'User already exist',
        user_not_exist: 'User not exist',
        sign_up_failed: 'Sign up failed',
        sign_in_failed: 'Sign in failed',
        invalid_password: 'Invalid password',
        params_empty: 'Params empty'
    }
};

module.exports = config;