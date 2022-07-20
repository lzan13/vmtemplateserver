/**
 * Create by lzan13 2020/7/6
 * 描述：上传操作控制类
 */
'use strict';
const Controller = require('egg').Controller;

class AttachmentController extends Controller {

  /**
   * 上传附件内
   * 要通过 ctx.getFileStream 便捷的获取到用户上传的文件，需要满足两个条件：
   * 1.只支持上传一个文件。
   * 2.上传文件必须在所有其他的 fields 后面，否则在拿到文件流时可能还获取不到 fields。
   */
  async create() {
    const { ctx, service } = this;
    // 通过 ctx.getFileStream 获取用户上传的文件
    const stream = await ctx.getFileStream();
    // 调用通用上传方法
    const params = await service.attachment.upload(stream);
    const attachment = await service.attachment.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '上传附件成功', data: attachment });
  }
  /**
   * 上传多个附件
   */
  async multipart() {
    const { app, ctx, service } = this;
    // 要获取同时上传的多个文件，需要通过 ctx.multipart() 来获取
    const parts = ctx.multipart();
    const result = [];

    let stream; // parts() return a promise
    while ((stream = await parts()) != null) {
      if (stream.length) {
        // 如果是数组的话是 fields
        app.logger.log('field: ' + stream[0]);
        app.logger.log('value: ' + stream[1]);
      } else {
        if (!stream.filename) {
          // 用户没有选择文件就点击了上传，这时 stream.filename 为空
          ctx.throw(412, '未收到附件内容');
        }
        // part 是上传的文件流
        // console.log('field: ' + stream.fieldname);
        // console.log('filename: ' + stream.filename);
        // console.log('extname: ' + stream.extname);
        // console.log('encoding: ' + stream.encoding);
        // console.log('mime: ' + stream.mime);

        // 获取参数
        // const filename = path.basename(stream.filename).toLowerCase(); // 文件名称
        // const extname = path.extname(stream.filename).toLowerCase(); // 文件扩展名称

        // 调用通用上传方法
        const params = await service.attachment.upload(stream);
        const attachment = await service.attachment.create(params);

        result.push(attachment);
      }
    }
    ctx.helper.success({ ctx, msg: '上传多个附件成功', data: result });
  }

  /**
   * 删除文件
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.attachment.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除附件成功' });
  }

  /**
   * 删除多个附件
   */
  async destroyList() {
    const { ctx, service } = this;
    // 组装参数
    const { ids } = ctx.params;
    const idArray = ids.split(',') || [];
    // 设置响应内容和响应状态码
    for (const id of idArray) {
      // 调用 Service 进行业务处理
      await service.attachment.destroy(id);
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '批量删除附件成功' });
  }

  /**
   * 更新文件
   */
  async update() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params; // 传入要修改的附件 Id
    const params = ctx.params.permit('desc', 'path', 'duration', 'extname', 'space', 'width', 'height');

    // 调用Service 保持原图片 Id 不变，更新其他属性
    const attachment = await service.attachment.update(id, params);

    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '附件更新成功', data: attachment });
  }

  /**
   * 获取单个文件
   */
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const attachment = await service.attachment.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, data: attachment });
  }

  /**
   * 获取所有文件(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const result = await service.attachment.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询数据成功', data: result });
  }

}


module.exports = AttachmentController;
