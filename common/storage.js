/**
 * Created by lzan13 on 2019/06/19.
 * 处理文件相关存储操作
 */

let fs = require("fs");
let path = require("path");
let multer = require("multer");

let config = require('../config');

// 定义 multer 配置
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, config.upload_dir);
    },

    filename: function (req, file, callback) {
        let extname = path.extname(file.originalname);
        let account = req.account;
        callback(null, file.fieldname + '_' + account._id + extname);
    }
});

/**
 * 上传头像
 */
exports.uploadAvatar = multer({
    storage: storage
}).single('avatar');

/**
 * 上传封面
 */
exports.uploadCover = multer({
    storage: storage
}).single('cover');

/**
 * 同步检查并创建文件夹
 */
exports.syncMkdirs = function (paths) {
    try {
        if (!fs.existsSync(paths)) {
            let tempPath;
            // 这里指用'/'or'\'分隔目录  如 Linux 的 /let/www/xxx 和 Windows 的 D:\workspace\xxx
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