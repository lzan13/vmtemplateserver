/**
 * 项目配置文件使用时复制到当前目录命名为 config.js 使用
 */
module.exports = {
    // 端口
    port: 8899,
    // 部署请求地址
    site_url: 'http://localhost:8899',
    public_dir: './public/',
    upload_dir: './public/upload/',

    /**
     * session 配置
     */
    session: {
        secret: 'vSessionSecret13', // 修改为自己独有的 secret 字符串
        key: 'vSessionKey13',   // 修改为自己独有的 key 字符串
        maxAge: 7 * 24 * 60 * 60 * 1000
    },

    /**
     * token 配置
     */
    token: {
        secret: 'vTokenSecret13', // 修改为自己独有的 secret 字符串
        expires: 60 * 60 // 测试过期用60秒
        // expires: 30 * 24 * 60 * 60
    },

    /**
     * 数据库配置
     */
    // mongodb_uri: 'mongodb://localhost:27017/vmserver',
    mongodb_uri: 'mongodb://localhost:27017/vmserver',
    mongodb_opts: {
        autoIndex: false, // Don't build indexes
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 10, // Maintain up to 10 socket connections, If not connected, return errors immediately rather than waiting for reconnect
        bufferMaxEntries: 0
    },

    /**
     * 邮箱配置
     */
    mail: {
        host: 'smtp.exmail.qq.com', // 主机地址
        port: 465,
        auth: {
            user: '通知邮箱',
            pass: '邮箱密码' // 这个密码要根据邮箱后台确认是使用账户密码，还是客户端独有的密码
        }
    },
    mail_from: '"VMLoft" <{通知邮箱}>',
    mail_subject_activate: 'VMLoft 账户激活',
    mail_content_activate: '<div style="width:100%; background-color:#f8f8f8; margin: 0; padding: 0; font-family: Roboto-Regular,Helvetica,Arial,sans-serif; font-size: 13px;"><div style="width: 100%; height: 36px;"></div><div style="min-width: 360px; max-width: 600px; margin: 20px auto; box-shadow: 0px 1px 2px #a8a8a8; border-radius:4px;"><div style="width:100%; color: #ffffff; background-color: #298afe; border-top-left-radius: 4px; border-top-right-radius: 4px; font-size: 22px; text-align:center;"><div style="padding: 20px;">激活你的账户</div></div><div style="width: 100%; text-align: left;  background-color: #ffffff;"><div style="min-width: 320px; max-width: 500px; margin: auto; color: #232323; line-height: 1.5; padding: 4px 0;"><div style="font-size: 18px; padding: 20px 10px;">尊敬的{0}，您好！</div><div style="padding: 10px;">感谢您注册 VMLoft 账户，请点击下边的链接激活您的账户</div><div style="padding: 5px 10px;"><a href="{1}/accounts/activate?account={2}&code={3}">激活账户</a></div><div style="padding: 10px;">如果你并没进行此类操作请忽略此邮件！</div><div style="padding: 24px 10px;">By-VMLoft团队</div></div></div><div style="min-width: 360px; max-width: 600px; padding: 5px; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; background-color: #f8f8f8; color: #898989">©️2017 VMLoft.</div></div><div style="width: 100%; height: 36px;"></div></div>',
    mail_subject_authcode: 'VMLoft 验证码',
    mail_content_authcode: '<div style="width:100%; background-color:#f8f8f8; margin: 0; padding: 0; font-family: Roboto-Regular,Helvetica,Arial,sans-serif; font-size: 13px;"><div style="width: 100%; height: 36px;"></div><div style="min-width: 360px; max-width: 600px; margin: 20px auto; box-shadow: 0px 1px 2px #a8a8a8; border-radius:4px;"><div style="width:100%; color: #ffffff; background-color: #298afe; border-top-left-radius: 4px; border-top-right-radius: 4px; font-size: 22px; text-align:center;"><div style="padding: 20px;">VMLoft 验证码</div></div><div style="width: 100%; text-align: left;  background-color: #ffffff; "><div style="min-width: 320px; max-width: 500px; margin: auto; color: #232323; line-height: 1.5; padding: 4px 0;"><div style="font-size: 18px; padding: 20px 10px;">尊敬的{0}，您好！</div><div style="padding: 10px;">您现在正在进行敏感操作，下边是您这次操作的验证码</div><div style="padding: 5px 10px;"><strong style="color: #ff7138; font-size: 20px">{1}</strong></div><div style="padding: 10px;">如果你并没进行此类操作请忽略此邮件！</div><div style="padding: 24px 10px;">By-VMLoft团队</div></div></div><div style="min-width: 360px; max-width: 600px; padding: 5px; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; background-color: #f8f8f8; color: #898989">©️2017 VMLoft.</div></div><div style="width: 100%; height: 36px;"></div></div>',

    /**
     * 请求结果状态码
     */
    code: {
        success: 0,
        // common code
        err_sys: 1000,
        err_sys_db: 1001,
        err_invalid_param: 1002,

        // permission error code
        err_token_invalid: 2000,
        err_token_expired: 2001,

        // account error code
        err_account_exist: 3000,
        err_account_name_exist: 3001,
        err_account_not_exist: 3002,
        err_account_deleted: 3003,
        err_account_no_verified: 3004,
        err_invalid_verify_link: 3005,
        err_invalid_password: 3006,

        err_upload_avatar: 4000,
        err_upload_cover: 4001,
        err_upload_picture: 4002,

    },

    // 分页大小
    limit_default: 20,

    /**
     * 构建响应体，并将响应结果返回给接口调用者，结果包含状态以及请求得到的数据
     * {
     *    "code": 0,
     *    "msg": 'success',
     *    "data": {}
     * }
     */
    result: { code: 0, msg: 'success', total_count: 0, data: {} }
};