/**
 * Create by lzan13 2020/07/13.
 * 描述：文件上传处理服务
 */

'use strict';
const fs = require('fs');
const path = require('path');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
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
    } else {
      const userId = ctx.state.user.id;
      const identity = ctx.state.user.identity;
      if (identity > 1 && attachment.owner !== userId) {
        ctx.throw(403, '无权操作，普通用户只能删除自己的附件');
      }
      const target = path.join(this.config.baseDir, this.config.uploadDir, `${attachment.id}${attachment.extname}`);
      try {
        fs.unlikeSync(target);
      } catch (err) {
        ctx.logger.debug('附件文件不存在，直接删除数据库数据');
      }
    }
    return ctx.model.Attachment.findByIdAndRemove(id);
  }

  /**
   * 更新附件信息
   * @param id
   * @param stream
   * @param filename
   * @param extname
   */
  async update(id, stream, filename, extname) {
    const { ctx, service } = this;
    const attachment = await service.attachment.find(id);
    // 先删除文件
    const target = path.join(this.config.baseDir, this.config.uploadDir, `${attachment.id}${attachment.extname}`);
    try {
      fs.unlikeSync(target);
    } catch (err) {
      ctx.logger.debug('附件文件不存在，直接更新');
    }
    // 更新附件参数
    attachment.owner = ctx.state.user.id;
    attachment.filename = filename;
    attachment.extname = extname;
    attachment.path = `/uploads/${attachment.id.toString()}${extname}`;
    // 处理文件流
    await service.attachment.handleStream(stream, attachment);
    return service.attachment.findByIdAndUpdate(id, attachment);
  }

  /**
   * 更新附件扩展信息
   * @param id
   * @param params
   */
  async extra(id, params) {
    const { ctx, service } = this;
    const attachment = await service.attachment.find(id);
    if (!attachment) {
      ctx.throw(404, `附件不存在 ${id}`);
    }
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
    totalCount = await this.ctx.model.Attachment.count(query).exec();

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

  /**
   * 通用的上传方法
   * @param stream 文件数据了
   * @param filename 文件名
   * @param extname 文件后缀
   * @return 返回包装好的附件数据
   */
  async upload(stream, filename, extname) {
    // 组装参数 model
    const attachment = new this.ctx.model.Attachment();
    attachment.owner = this.ctx.state.user.id;
    attachment.filename = filename;
    attachment.extname = extname;
    attachment.path = `/uploads/${attachment.id.toString()}${extname}`;
    this.ctx.helper.syncCreateDirs(this.app.config.uploadDir);
    // 处理文件流
    await this.handleStream(stream, attachment);
    return attachment;
  }

  /**
   * 处理数据流
   * @param stream
   * @param params
   */
  async handleStream(stream, params) {
    const target = path.join(this.config.baseDir, this.config.uploadDir, `${params.id.toString()}${params.extname}`);
    const writeStream = fs.createWriteStream(target);
    // 文件处理，上传到云存储等等
    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream);
      throw err;
    }
  }
}

module.exports = AttachmentService;
