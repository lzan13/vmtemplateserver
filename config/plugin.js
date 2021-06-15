'use strict';

/**
 * @type Egg.EggPlugin
 */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
// };

/**
 * 启用 插件 egg-alinode，用于监控分析服务
 */
exports.alinode = {
  enable: true,
  env: [ 'prod' ],
  package: 'egg-alinode',
};

exports.bcrypt = {
  enable: true,
  package: 'egg-bcrypt',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

/**
 * 启用插件 egg-jwt，用于 token 生成与校验
 */
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};

/**
 * 启用插件 egg-mongoose，用于操作 MongoDB 数据库
 */
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

/**
 * 启用 插件 egg-parameters，用于校验参数
 */
exports.parameters = {
  enable: true,
  package: 'egg-parameters',
};

/**
 * 启用插件 egg-static，访问静态数据
 */
// exports.static = {
//   enable: true,
//   package: 'egg-static',
// };

/**
 * 启用插件 egg-validate，用于参数验证
 */
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
