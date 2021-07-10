/**
 * Create by lzan13 2020/7/6
 * 描述：上传操作控制类
 */
'use strict';
const path = require('path');
const Controller = require('egg').Controller;

class AttachmentController extends Controller {

  /**
   * 创建附件
   */
  async create() {
    const { ctx, service } = this;
    const params = ctx.params;
    const attachment = await service.attachment.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '创建附件成功', data: attachment });
  }

  /**
   * 通过网络地址创建附件: 如果网络地址不合法，EGG会返回500错误
   */
  async createByUrl() {
    const { ctx, service } = this;
    // 组装参数
    let attachment = new this.ctx.model.Attachment();
    const { url } = ctx.params;
    const filename = path.basename(url)
      .toLowerCase(); // 文件名称
    const extname = path.extname(url)
      .toLowerCase(); // 文件扩展名称
    attachment.extname = extname;
    attachment.filename = filename;
    attachment.path = url;

    attachment = await service.attachment.create(attachment);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '保存网络资源成功', data: attachment });
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
    const { id } = ctx.params; // 传入要修改的文档 Id
    const params = ctx.params.permit('filename', 'extname', 'path', 'extra');
    // 先判断下权限
    let attachment = await service.attachment.find(id);
    if (!attachment) {
      ctx.throw(404, '附件不存在');
    }

    // 调用Service 保持原图片 Id 不变，更新其他属性
    attachment = await service.attachment.update(id, params);

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
