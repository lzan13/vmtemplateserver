/**
 * Created by lzan13 on 2019/06/19.
 * 处理文件相关存储操作
 */

var fs = require("fs");
var path = require("path");
var multer = require("multer");

var config = require('../config');

// 定义 multer 配置
var storage = multer.diskStorage({
    destination: function (reg, file, callback) {
        callback(null, config.upload_dir);
    },

    filename: function (req, file, callback) {
        let extname = path.extname(file.originalname);
        callback(null, file.fieldname + '_' + Date.now() + extname);
    }
});

exports.uploadAvatar = multer({
    storage: storage
}).single('avatar');


/**
 * 同步检查并创建文件夹
 */
exports.syncMkdirs = function (paths) {
    try {
        if (!fs.existsSync(paths)) {
            let tempPath;
            // 这里指用'/'or'\'分隔目录  如 Linux 的 /var/www/xxx 和 Windows 的 D:\workspace\xxx
            paths.split(/[/\\]/).forEach(function (dirName) {
                if (tempPath) {
                    tempPath = path.join(tempPath, dirName);
                } else {
                    tempPath = dirName;
                }
                if (!fs.existsSync(tempPath)) {
                    if (!fs.mkdirSync(tempPath)) {
                        return false;
                    }
                }
            });
        }
        return true;
    } catch (e) {
        logger.e("创建目录失败 path:%s, msg:%s", paths, e);
        return false;
    }
}