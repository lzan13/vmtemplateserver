/************************************************************************
 *
 * 项目配置文件
 * 运行项目时需要复制一份到当前目录，并命名为 app.config.js
 *
 ************************************************************************/
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
     * 环信相关配置
     */
    em_org_name: '开发者企业 id，appkey 前半部分',
    em_app_name: '开发者后台 app name，appkey 后半部分',
    em_base_url: 'rest api 地址',
    em_client_id: '环信后台 appkey 下的 client id',
    em_client_secret: '环信后台 appkey 下的 client secret',

    /**
     * 定义项目错误码以及错误描述
     * 系统状态码
     */
    code: {
        no_error: 0,
        // 系统级别状态码
        db_exception: 1001,
        request_failed: 1002,
        // 应用级别状态码
        params_empty: 2000,
        data_is_empty: 2001,
        user_already_exist: 2002,
        user_not_exist: 2003,
        sign_up_failed: 2004,
        sign_in_failed: 2005,
        invalid_password: 2006,
        no_permission_action: 2007,
        user_is_disable: 2008,
        duplication_request: 2009
    },

    /**
     * 定义常用字符串
     */
    msg: {
        undefined: 'undefined',
        // 状态描述
        success: 'success',
        db_exception: 'Service db exception ',
        request_failed: 'Request failed',
        params_empty: 'Params empty',
        data_is_empty: 'Data is empty',
        user_already_exist: 'User already exist',
        user_not_exist: 'User not exist',
        sign_up_failed: 'Sign up failed',
        sign_in_failed: 'Sign in failed',
        invalid_password: 'Invalid password',
        no_permission_action: 'No permission action',
        user_is_disable: 'User is disabled',
        duplication_request: 'Duplication request'
    }
};

module.exports = config;