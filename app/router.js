/**
 * Create by lzan13 2021/1/13
 * 描述：路由配置类
 */
'use strict';
module.exports = app => {

  /**
   * RESTful 风格接口与方法对应关系
   */
  // Method	  Path Simple       Route Name	Controller.Action
  // GET	    /posts/new	      new_post	  app.controller.posts.new
  // GET	    /posts/:id/edit	  edit_post	  app.controller.posts.edit
  // POST	    /posts	          posts	      app.controller.posts.create
  // DELETE	  /posts/:id	      post	      app.controller.posts.destroy
  // PUT	    /posts/:id	      post	      app.controller.posts.update
  // GET	    /posts/:id	      post	      app.controller.posts.show
  // GET	    /posts	          posts	      app.controller.posts.index

  require('./router/admin')(app);
  require('./router/common')(app);
  require('./router/im')(app);
  require('./router/info')(app);
  require('./router/sign')(app);

};
