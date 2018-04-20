/**
 * Created by lzan13 on 2017/11/8.
 * api 路由类
 */

var express = require('express');
var router = express.Router();

var admin = require('./api/v1/admin');
var auth = require('./common/auth');
var account = require('./api/v1/account');
var note = require('./api/v1/note');
var tag = require('./api/v1/tag');

var test = require('./api/v1/test');

/**
 * 测试接口
 */
router.post('/test', test.testFormatStr);

/**
 * 管理员相关操作
 */
router.get('/accounts', auth.authAdmin, admin.getAllAccounts); // 查询所有账户

/**
 * 账户相关路由配置
 */
router.post('/accounts', account.createAccountByEmail); // 创建账户
router.put('/accounts/name', auth.authToken, account.updateAccountName); // 更新账户名称
router.put('/accounts/avatar', auth.authToken, account.updateAccountAvatar); // 更新账户头像
router.put('/accounts/cover', auth.authToken, account.updateAccountCover); // 更新账户封面
router.put('/accounts/info', auth.authToken, account.updateAccountInfo); // 更新账户信息
router.put('/accounts/password', auth.authToken, account.changePassword); // 修改密码
router.post('/accounts/auth', account.authAccount); // token 认证
router.get('/accounts/activate', account.activateAccount); // 账户激活
router.get('/accounts/:name/info', account.getAccount); // 获取账户信息
router.get('/accounts/search', auth.authToken, account.searchAccounts);

/**
 * 文章相关路由配置
 */
router.post('/notes', auth.authToken, note.createNote); // 创建笔记
router.put('/notes/:id', auth.authToken, note.updateNote); // 更新笔记
/**
 * 可以通过 query 方式查询笔记，比如通过分页、标签查询，如下形式：
 * '/notes?page=1&limit=20&tags=Android,RxJava'
 */
router.get('/notes', auth.authToken, note.getAllNotes);
router.get('/notes/:id/info', auth.authToken, note.getNoteById); // 获取指定 id 的笔记
router.get('/notes/count', auth.authToken, note.getNotesCount); // 符合条件的笔记数量
router.get('/notes/sync', auth.authToken, note.syncNotes); // 增量同步数据
router.get('/notes/search', auth.authToken, note.searchNotes); // 搜索笔记
router.get('/notes/tags', auth.authToken, tag.getAllTags); // 获取全部笔记标签

/**
 * 回收站
 */
router.get('/trash', auth.authToken, note.getNotesForTrash); // 获取回收站的笔记
router.post('/trash/add/:id', auth.authToken, note.addNoteToTrash); // 移除笔记到回收站
router.post('/trash/restore/:id', auth.authToken, note.restoreNoteForTrash); // 从回收站恢复笔记
router.delete('/trash/remove/:id', auth.authToken, note.removeNoteForever); // 彻底删除笔记
router.delete('/trash/clear', auth.authToken, note.clearNotesForTrash); // 清空回收站

module.exports = router;
