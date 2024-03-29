/**
 * Created by lzan13 on 2020/07/06.
 * 描述：用户数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  /**
   * 构建用户数据信息结构，主要包含字段:
   */
  const UserSchema = new mongoose.Schema({
    devicesId: { type: String, unique: true, index: true }, // 设备 Id，用来限制设备只能注册单账户
    username: { type: String, index: true }, // 用户名
    email: { type: String }, // 邮箱
    emailVerify: { type: Boolean, default: false }, // 邮箱验证状态
    phone: { type: String }, // 手机号
    phoneVerify: { type: Boolean, default: false }, // 手机号验证状态
    password: { type: String }, // 密码，加密存储，理论上只有用户自己知道自己的密码，后端管理员也不可能知道
    avatar: { type: String }, // 头像
    cover: { type: String }, // 封面
    birthday: { type: String, default: '1990-01-01' }, // 生日
    gender: { // 性别：0 女，1 男，2 神秘
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 2,
    },
    nickname: { type: String }, // 昵称
    signature: { type: String }, // 签名
    address: { type: String }, // 地址
    hobby: { type: String }, // 爱好

    score: { type: Number, default: 100 }, // 积分

    charm: { type: Number, default: 0 }, // 总魅力
    charmMonth: { type: Number, default: 0 }, // 月魅力，每月清零
    charmWeek: { type: Number, default: 0 }, // 周魅力，每周清零

    clockContinuousCount: { type: Number, default: 0 }, // 打卡连续次数
    clockTotalCount: { type: Number, default: 0 }, // 打卡总次数
    clockTime: { type: Number }, // 最后一次打卡时间

    fansCount: { type: Number, default: 0 }, // 粉丝数量
    followCount: { type: Number, default: 0 }, // 关注数量
    likeCount: { type: Number, default: 0 }, // 喜欢我数量
    matchCount: { type: Number, default: 30 }, // 可用匹配次数，为0后需要消耗积分，签到后重置
    fastCount: { type: Number, default: 30 }, // 可用快速聊天次数，为0后需要消耗积分，签到后重置
    postCount: { type: Number, default: 0 }, // 帖子数量

    strangerMsg: { type: Boolean, default: true }, // 陌生人私信

    profession: { type: mongoose.Schema.Types.ObjectId, ref: 'Profession' }, // 职业
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }, // 角色，和角色数据关联，不同角色拥有不同权限，默认为普通用户
    roleTime: { type: Number }, // 角色到期时间，到期后自动变为普通用户

    token: { type: String }, // 账户 token，记录账户登录认证信息

    ip: { type: String }, // IP地址
    devices: { type: String }, // 设备信息

    idCardNumber: { type: String }, // 身份证号
    realName: { type: String }, // 真实姓名

    banned: { type: Number, enum: [ 0, 1 ] }, // 禁言状态 0-未禁言 1-禁言中
    bannedTime: { type: Number }, // 禁言到期时间
    bannedReason: { type: String }, // 禁言理由

    deleted: { type: Number, enum: [ 0, 1, 2 ], default: 0 }, // 记录是否删除，只是软删除，防止恶意注册捣乱 0-未删除 1-用户主动销户 2-违反平台规定
    deletedReason: { type: String }, // 删除理由
    deletedAt: { type: Number },
    createdAt: { type: Number },
    updatedAt: { type: Number },
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { currentTime: () => Date.now(), createdAt: true, updatedAt: true }, // 时间戳配置
  });

  return mongoose.model('User', UserSchema);
};
