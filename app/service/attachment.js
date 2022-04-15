/**
 * Create by lzan13 2020/07/13.
 * 描述：文件上传处理服务
 */
'use strict';
const path = require('path');
const Service = require('egg').Service;

// 附件支持的种类
const kinds = {
  binary: [ '.7z', '.apk', '.gz', '.gzip', '.rar', '.tgz', '.zip' ],
  document: [ '.csv', '.doc', '.docx', '.pdf', '.ppt', '.pptx', '.xls', '.xlsx', '.key', '.numbers', '.pages', '.json', '.txt' ],
  image: [ '.gif', '.ico', '.jpg', '.jpeg', '.png', 'svg', '.webp' ],
  voice: [ '.amr', '.mp3', '.ogg' ],
  video: [ '.avi', '.mp4' ],
};

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
      if (identity < 200 && attachment.owner !== userId) {
        ctx.throw(403, '无权操作，普通用户只能删除自己的附件');
      }
      await this.service.third.upyun.deleteFile(attachment.path);
    }
    return ctx.model.Attachment.findByIdAndRemove(id);
  }

  /**
   * 更新附件信息
   */
  async update(id, params) {
    const { ctx, service } = this;
    // 先判断下权限
    const attachment = await service.attachment.find(id);
    if (!attachment) {
      ctx.throw(404, '附件不存在');
    }
    // 处理文件流
    return await service.attachment.findByIdAndUpdate(id, params);
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
    const { page, limit, kind } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    const skip = Number(page) * Number(limit || 20);
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
    totalCount = await this.ctx.model.Attachment.countDocuments(query)
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

  /**
   * 通用的上传方法
   * @param stream 文件数据
   * @param space 文件存储目录
   * @return 返回包装好的附件数据
   */
  async upload(stream, dir) {
    // 组装参数 model
    const attachment = new this.ctx.model.Attachment();
    attachment.owner = this.ctx.state.user.id;

    // 所有表单字段都能通过 `stream.fields` 获取到
    attachment.extname = path.extname(stream.filename)
      .toLowerCase(); // 文件扩展名称
    // 文件描述
    if (stream.fields.desc) {
      attachment.desc = stream.fields.desc;
    } else {
      attachment.desc = path.basename(stream.filename)
        .toLowerCase();
    }
    // 持续时间 video/voice 有此值
    if (stream.fields.duration) {
      attachment.duration = stream.fields.duration;
    }
    if (stream.fields.width) {
      attachment.width = stream.fields.width;
    }
    if (stream.fields.height) {
      attachment.height = stream.fields.height;
    }

    // 判断附件上传目录空间
    let space = '';
    if (stream.fields.space) {
      space = stream.fields.space;
    } else {
      if (kinds.binary.indexOf(attachment.extname) !== -1) {
        // 二进制文件默认都上传到下载目录
        space = 'download';
        if (dir) {
          space += `/${dir}`;
        }
      } else if (kinds.document.indexOf(attachment.extname) !== -1) {
        // 文档默认都上传到文档目录
        space = 'document';
        if (dir) {
          space += `/${dir}`;
        }
      } else if (kinds.image.indexOf(attachment.extname) !== -1) {
        // 图片默认都上传到 post 子目录下
        space = 'image';
        if (dir) {
          space += `/${dir}`;
        } else {
          space += '/post';
        }
      } else if (kinds.voice.indexOf(attachment.extname) !== -1) {
        // 声音默认都上传到声音目录下
        space = 'voice';
        if (dir) {
          space += `/${dir}`;
        }
      } else if (kinds.video.indexOf(attachment.extname) !== -1) {
        // 视频默认都上传到视频目录下
        space = 'video';
        if (dir) {
          space += `/${dir}`;
        }
      }
    }
    attachment.path = `/${space}/${attachment.id.toString()}${attachment.extname}`;
    // 处理文件流，这里是将文件内容转存到三方云存储
    const result = await this.service.third.upyun.putFile(attachment.path, stream);
    if (result) {
      return attachment;
    }
    this.ctx.throw(412, '附件上传到云存储失败');
  }

}

module.exports = AttachmentService;
