/**
 * Created by lzan13 on 2016/12/18.
 * 好友数据模型
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FriendSchema = new Schema({
    username: {type: String, required: true, unique: false},
    friend_username: {type: String, required: true, unique: false},
    time: {type: Date, default: Date.now}
});

mongoose.model('Friend', FriendSchema);
