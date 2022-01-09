/**
 * Create by lzan13 2021/11/08
 * 描述：管理员服务处理
 */
'use strict';

const Controller = require('egg').Controller;

class AdminService extends Controller {

  /**
   * 仪表盘数据接口
   */
  async dashboard() {
    const data = {
      common: {},
      feedback: {},
      match: {},
      post: {},
      user: {},
    };
    data.user = await this.statisticsUser();
    data.match = await this.statisticsMatch();
    data.post = await this.statisticsPost();
    data.feedback = await this.statisticsFeedback();

    return data;
  }

  /**
   * 统计用户数据
   */
  async statisticsUser() {
    const { ctx } = this;

    const user = {
      totalCount: 0,
      dayCount: 0,
      weekCount: 0,
      monthCount: 0,
      news: [],
      genders: [],
    };
    // 查询性别分布
    let query = [
      { $group: { _id: '$gender', value: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ];
    let result = await ctx.model.User.aggregate(query);
    result.forEach(item => {
      user.totalCount += item.value;
      if (item._id === 0) {
        user.genders.push({ value: item.value, name: '女' });
      } else if (item._id === 1) {
        user.genders.push({ value: item.value, name: '男' });
      } else {
        user.genders.push({ value: item.value, name: '神秘' });
      }
    });

    // 查询(1日/7日/30日)新增数据，以及30日内每日新增趋势
    const dayTime = this.timePeriod(1);
    const weekTime = this.timePeriod(7);
    const monthTime = this.timePeriod(30);
    query = [
      { $match: { createdAt: { $gte: monthTime.start, $lte: monthTime.end } } },
      { $group: { _id: { createdAt: { $dateToString: { format: '%Y/%m/%d', date: '$createdAt' } } }, value: { $sum: 1 } } },
      { $sort: { '_id.createdAt': 1 } },
    ];
    result = await ctx.model.User.aggregate(query);
    result.forEach(item => {
      user.news.push({ value: item.value, name: item._id.createdAt });
      if (new Date(item._id.createdAt) >= dayTime.start) {
        user.dayCount += item.value;
        user.weekCount += item.value;
        user.monthCount += item.value;
      } else if (new Date(item._id.createdAt) >= weekTime.start) {
        user.weekCount += item.value;
        user.monthCount += item.value;
      } else {
        user.monthCount += item.value;
      }
    });
    return user;
  }

  /**
   * 统计匹配数据
   */
  async statisticsMatch() {
    const { ctx } = this;

    const match = {
      totalCount: 0,
      dayCount: 0,
      weekCount: 0,
      monthCount: 0,
      news: [],
      genders: [],
      emotions: [],
    };
    // 查询性别分布
    let query = [
      { $group: { _id: '$gender', value: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ];
    let result = await ctx.model.Match.aggregate(query);
    result.forEach(item => {
      match.totalCount += item.value;
      if (item._id === 0) {
        match.genders.push({ value: item.value, name: '女' });
      } else if (item._id === 1) {
        match.genders.push({ value: item.value, name: '男' });
      } else {
        match.genders.push({ value: item.value, name: '神秘' });
      }
    });

    // 查询心情分布
    query = [{ $group: { _id: '$emotion', value: { $sum: 1 } } }];
    result = await ctx.model.Match.aggregate(query);
    result.forEach(item => {
      if (item._id === 0) {
        match.emotions.push({ value: item.value, name: '😄开心' });
      } else if (item._id === 1) {
        match.emotions.push({ value: item.value, name: '😑平淡' });
      } else if (item._id === 2) {
        match.emotions.push({ value: item.value, name: '😞难过' });
      } else {
        match.emotions.push({ value: item.value, name: '😡愤怒' });
      }
    });

    // 查询(1日/7日/30日)新增数据，以及30日内每日新增趋势
    const dayTime = this.timePeriod(1);
    const weekTime = this.timePeriod(7);
    const monthTime = this.timePeriod(30);
    query = [
      { $match: { updatedAt: { $gte: monthTime.start, $lte: monthTime.end } } },
      { $group: { _id: { updatedAt: { $dateToString: { format: '%Y/%m/%d', date: '$updatedAt' } } }, value: { $sum: 1 } } },
      { $sort: { '_id.updatedAt': 1 } },
    ];
    result = await ctx.model.Match.aggregate(query);
    result.forEach(item => {
      match.news.push({ value: item.value, name: item._id.updatedAt });
      if (new Date(item._id.updatedAt) >= dayTime.start) {
        match.dayCount += item.value;
        match.weekCount += item.value;
        match.monthCount += item.value;
      } else if (new Date(item._id.updatedAt) >= weekTime.start) {
        match.weekCount += item.value;
        match.monthCount += item.value;
      } else {
        match.monthCount += item.value;
      }
    });

    return match;
  }

  /**
   * 统计帖子数据
   */
  async statisticsPost() {
    const { ctx } = this;

    const post = {
      totalCount: 0,
      dayCount: 0,
      weekCount: 0,
      monthCount: 0,
      news: [],
      categories: [],
    };
    const category = {};
    let result = await ctx.model.Category.aggregate([{ $project: { title: 1 } }]);
    result.forEach(item => {
      category[item._id] = item.title;
    });
    // 查询性别分布
    let query = [{ $group: { _id: '$category', value: { $sum: 1 } } }];
    result = await ctx.model.Post.aggregate(query);
    result.forEach(item => {
      post.totalCount += item.value;
      post.categories.push({ value: item.value, name: category[item._id] });
    });

    // 查询(1日/7日/30日)新增数据，以及30日内每日新增趋势
    const dayTime = this.timePeriod(1);
    const weekTime = this.timePeriod(7);
    const monthTime = this.timePeriod(30);
    query = [
      { $match: { createdAt: { $gte: monthTime.start, $lte: monthTime.end } } },
      { $group: { _id: { createdAt: { $dateToString: { format: '%Y/%m/%d', date: '$createdAt' } } }, value: { $sum: 1 } } },
      { $sort: { '_id.createdAt': 1 } },
    ];
    result = await ctx.model.Post.aggregate(query);
    result.forEach(item => {
      post.news.push({ value: item.value, name: item._id.createdAt });
      if (new Date(item._id.createdAt) >= dayTime.start) {
        post.dayCount += item.value;
        post.weekCount += item.value;
        post.monthCount += item.value;
      } else if (new Date(item._id.createdAt) >= weekTime.start) {
        post.weekCount += item.value;
        post.monthCount += item.value;
      } else {
        post.monthCount += item.value;
      }
    });
    return post;
  }

  /**
   * 统计反馈数据
   */
  async statisticsFeedback() {
    const { ctx } = this;

    const feedback = {
      totalCount: 0,
      dayCount: 0,
      weekCount: 0,
      monthCount: 0,
      news: [],
    };
    // 查询总数
    feedback.totalCount = await this.ctx.model.Feedback.estimatedDocumentCount();
    // 查询(1日/7日/30日)新增数据，以及30日内每日新增趋势
    const dayTime = this.timePeriod(1);
    const weekTime = this.timePeriod(7);
    const monthTime = this.timePeriod(30);
    const query = [
      { $match: { createdAt: { $gte: monthTime.start, $lte: monthTime.end } } },
      { $group: { _id: { createdAt: { $dateToString: { format: '%Y/%m/%d', date: '$createdAt' } } }, value: { $sum: 1 } } },
      { $sort: { '_id.createdAt': 1 } },
    ];
    const result = await ctx.model.Feedback.aggregate(query);
    result.forEach(item => {
      feedback.news.push({ value: item.value, name: item._id.createdAt });
      if (new Date(item._id.createdAt) >= dayTime.start) {
        feedback.dayCount += item.value;
        feedback.weekCount += item.value;
        feedback.monthCount += item.value;
      } else if (new Date(item._id.createdAt) >= weekTime.start) {
        feedback.weekCount += item.value;
        feedback.monthCount += item.value;
      } else {
        feedback.monthCount += item.value;
      }
    });
    return feedback;
  }

  /**
   * 获取时间间隔
   * @param day 要获取的时间间隔
   */
  timePeriod(day) {
    const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - day * 24 * 60 * 60 * 1000); // 哪一天 00:00:00
    const end = new Date(new Date(new Date().toLocaleDateString()).getTime() - 1);// 昨天 23:59:59
    return { start, end };
  }

}

module.exports = AdminService;
