/**
 * Created by lzan13 on 16/9/20.
 * 主要处理信息展示的一些请求，网站主页，个人主页等
 */

exports.index = function (req, res) {
    res.render('index.ejs', {title: "我的服务器"})
};