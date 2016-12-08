/**
 * Created by lzan13 on 2016/9/22.
 * 用户数据模型
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    username: {type: String},
    password: {type: String}
});

mongoose.model('User', UserSchema);