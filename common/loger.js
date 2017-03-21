/**
 * Created by lzan13 on 2017/1/4.
 * 简单封装日志输出类
 */

var info = "info - ";
var debug = "debug - ";
var error = "error - ";

exports.i = function (msg) {
    console.log(JSON.stringify(msg));
    console.log(info + msg);
};

exports.d = function (msg) {
    console.log(JSON.stringify(msg));
    console.log(debug + msg);
};

exports.e = function (msg) {
    console.log(error + msg);
};

