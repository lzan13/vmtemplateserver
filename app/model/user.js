/**
 * Created by lzan13 on 2020/07/06.
 * 描述：用户数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  /**
   * 构建用户数据信息结构，主要包含字段:
   * devicesId
   * username
   * email
   * emailVerify
   * phone
   * phoneVerify
   * password
   * avatar
   * cover
   * birthday
   * gender
   * nickname
   * signature
   * address
   * hobby
   * score
   * clockContinuousCount
   * clockTotalCount
   * clockTime
   * fansCount
   * followCount
   * likeCount
   * postCount
   * profession
   * role
   * token
   * code
   * idCardNumber
   * realName
   * deleted
   * deletedReason
   * deletedAt
   * createdAt
   * updatedAt
   * @type {mongoose.Schema}
   */
  const UserSchema = new mongoose.Schema({
    // 设备 Id，用来限制设备只能注册单账户
    devicesId: { type: String, unique: true, index: true },
    // 用户名
    username: { type: String, index: true },
    // 邮箱
    email: { type: String },
    // 邮箱验证状态
    emailVerify: { type: Boolean, default: false },
    // 手机号
    phone: { type: String },
    // 手机号验证状态
    phoneVerify: { type: Boolean, default: false },
    // 密码，加密存储，理论上只有用户自己知道自己的密码，后端管理员也不可能知道
    password: { type: String },
    // 头像
    avatar: { type: String },
    // 封面
    cover: { type: String },
    // 生日
    birthday: { type: String, default: '1990-1-1' },
    // 性别：0 女，1 男，2 神秘
    gender: {
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 2,
    },
    // 昵称
    nickname: { type: String },
    // 签名
    signature: { type: String },
    // 地址
    address: { type: String },
    // 爱好
    hobby: { type: String },
    // 积分
    score: { type: Number, default: 100 },
    // 打卡连续次数
    clockContinuousCount: { type: Number, default: 0 },
    // 打卡总次数
    clockTotalCount: { type: Number, default: 0 },
    // 最后一次打卡时间
    clockTime: { type: Date },
    // 粉丝数量
    fansCount: { type: Number, default: 0 },
    // 关注数量
    followCount: { type: Number, default: 0 },
    // 喜欢我数量
    likeCount: { type: Number, default: 0 },
    // 帖子数量
    postCount: { type: Number, default: 0 },
    // 职业
    profession: { type: mongoose.Schema.Types.ObjectId, ref: 'Profession' },
    // 角色，和角色数据关联，不同角色拥有不同权限，默认为普通用户
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    // 账户 token，记录账户登录认证信息
    token: { type: String },
    // 身份证号
    idCardNumber: { type: String },
    // 真实姓名
    realName: { type: String },
    // 记录是否删除，只是软删除，防止恶意注册捣乱 0-未删除 1-用户主动销户 2-违反平台规定
    deleted: { type: Number, enum: [ 0, 1, 2 ], default: 0 },
    // 删除理由
    deletedReason: { type: String },
    // 创建/修改/删除 时间
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date },
  },
  // schema 的选项options
  {
    // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    id: true,
    // 生成时间
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  });

  return mongoose.model('User', UserSchema);
};
