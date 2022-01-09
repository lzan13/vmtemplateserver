/**
 * Create by lzan13 2021/7/2
 * 描述：又拍云服务类
 */
'use strict';

const Service = require('egg').Service;
const UPYun = require('upyun');

class UPYunService extends Service {


  /**
   * 生成又拍云 token
   */
  async upyunToken(params) {
    const { app, ctx } = this;
    /**
     * {
     *    "operator": "operator123",
     *    "password": "password123",
     *    "method": "PUT",
     *    "prefix": "/bucket/client_37ascii",
     *    "expire": "1528531186"
     * }
     */
    // 将密码进行 MD5 加密
    const password = ctx.helper.cryptoMD5(app.config.upyun.password);
    // 拼接参数
    const content = `${params.method}&${params.prefix}&${params.expire}`;
    // 使用密码与参数计算 HMACSHA1 签名获取
    const hmacsha1 = ctx.helper.cryptoHMACSHA1(content, password);
    // 将 hmacsha1 进行 base64 编码
    const signature = ctx.helper.strToBase64(hmacsha1);
    // 拼接 token
    return `UPYUN ${app.config.upyun.operator}:${signature}`;
  }

  /**
   * 获取 UPYun client 操作对象
   */
  async upyunClient() {
    const { app } = this;
    const service = new UPYun.Service(app.config.upyun.bucket, app.config.upyun.operator, app.config.upyun.password);
    return new UPYun.Client(service);
  }

  /**
   * 创建子目录
   */
  async makeDir(path) {
    const client = await this.upyunClient();
    return await client.makeDir(path);
  }

  /**
   * 上传文件
   * @param path 远程保存路径
   * @param file 文件内容，
   *        服务端支持 String | Stream | Buffer,
   *        浏览器端支持 File | String 注意 String 表示文件内容，不是本地文件路径
   * @param options
   * @return {Promise<void>}
   */
  async putFile(path, file, options) {
    const client = await this.upyunClient();
    return await client.putFile(path, file, options);
  }

  /**
   * 删除文件或目录
   * @param path
   */
  async deleteFile(path) {
    const client = await this.upyunClient();
    return await client.deleteFile(path);
  }

  /**
   * 查看目录大小
   */
  async dirSize(path) {
    const client = await this.upyunClient();
    const result = await client.usage(path);
    console.log(`dir:${path} size:${result}`);
    return result;
  }

  /**
   * 查看目录下文件
   */
  async dirFiles(path, iter = '') {
    /**
     * {
     *    files: [
     *      {
     *        name: 'example.txt', // file or dir name
     *        type: 'N', // file type, N: file; F: dir
     *        size: 28392812, // file size
     *        time: 1486053098 // last modify time
     *      }
     *    ],
     *    next: 'dlam9pd2Vmd2Z3Zg==' // next page iter
     * }
     */
    const client = await this.upyunClient();
    return await client.listDir(path, { iter });
  }


}

module.exports = UPYunService;
