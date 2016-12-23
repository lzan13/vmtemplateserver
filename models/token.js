/**
 * Created by lzan13 on 2016/12/18.
 * Token 相关数据模型
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TokenSchema = new Schema({
    access_name: {type: String},
    access_token: {type: String, required: true, unique: true},
    deadline: {type: Number}
});

mongoose.model('Token', TokenSchema);
