/**
 * Create by lzan13 2020/07/13.
 * 描述：文件上传处理服务
 */
'use strict';
const Service = require('egg').Service;

class AttachmentService extends Service {

  async create(params) {
    return this.ctx.model.Attachment.create(params);
  }

  /**
   * 删除附件
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    const attachment = await service.attachment.find(id);
    if (!attachment) {
      ctx.throw(404, `附件不存在 ${id}`);
    }
    return ctx.model.Attachment.findByIdAndRemove(id);
  }

  /**
   * 更新附件信息
   */
  async update(id, params) {
    const { service } = this;
    // 处理文件流
    return service.attachment.findByIdAndUpdate(id, params);
  }

  /**
   * 获取附件
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const attachment = await service.attachment.find(id);
    if (!attachment) {
      ctx.throw(404, `附件不存在 ${id}`);
    }
    return attachment;
  }

  /**
   * 获取全部附件
   * @param params
   */
  async index(params) {
    // 支持全部all 无需传入kind
    const kinds = {
      binary: [ '7z', 'rar', '.zip', '.gz', '.tgz', '.gzip' ],
      document: [ '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.csv', '.key', '.numbers', '.pages', '.pdf', '.txt', '.psd' ],
      image: [ '.jpg', '.jpeg', '.png', '.gif' ],
      audio: [ '.mp3', '.wma', '.wav', '.ogg', '.ape', '.acc' ],
      video: [ '.mov', '.mp4', '.avi' ],
    };

    const { page, limit, kind } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    const skip = Number(page) * Number(limit || 10);
    const query = {};
    if (kind) {
      query.extname = { $in: kinds[kind] };
    }
    result = await this.ctx.model.Attachment
      .find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await this.ctx.model.Attachment.count(query)
      .exec();

    // 整理数据源 -> Ant Design Pro
    const data = result.map((e, i) => {
      const json = Object.assign({}, e._doc);
      json.key = i;
      // json.createdAt = this.ctx.helper.formatTime(e.createdAt);
      return json;
    });

    return { currentCount, totalCount, page: Number(page), limit: Number(limit), data };
  }

  /**
   * ===================================================================================
   * 通用方法，主要是这些方法有多个地方调用，简单封装下
   */
  /**
   * 通过 Id 查找附件
   * @param id 附件 Id
   */
  async find(id) {
    return this.ctx.model.Attachment.findById(id);
  }

  /**
   * 更新附件信息
   * @param id 附件 Id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Attachment.findByIdAndUpdate(id, params, { new: true });
  }
}

module.exports = AttachmentService;
