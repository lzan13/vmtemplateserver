/**
 * Created by lzan13 on 2016/9/12.
 *
 * 项目中用到的一些方法
 */

/**
 * 拖过设置position的fixed属性来实现滚动页面后导航条固定在顶部
 *----------------------------------------------------
 */
$(function () {
    var header = $('#header');
    var scrollTop;
    header.attr('headerTop', header.offset().top); //存储原来的距离顶部的距离
    $(window).scroll(function () {
        scrollTop = Math.max(document.body.scrollTop || document.documentElement.scrollTop);
        if (scrollTop > parseInt(header.attr('headerTop'))) {
            $('#header').attr('class', 'scroll-header');
        } else {
            $('#header').attr('class', 'normal-header');
        }
    });
});

/**
 * 动态回到顶部和底部
 *----------------------------------------------------
 */
$(function () {
    //定义返回顶部点击向上滚动的动画
    $(".scroll-top").click(function () {
        $('body,html').animate({'scrollTop': 0}, 500);
    });
    //
    // $("#header-nav").click(function() {
    //     $('body,html').animate({ scrollTop: 0 }, 300);
    // });
    // $("#header-menu").click(function() {
    //     if($("#header-menu").css('display') == 'block') { //防止宽屏上点击
    //         $("#main-menu").toggle(0);
    //     };
    // });
    // $("#main-menu,#nav-right,#header-menu").click(function(e){
    //     e.stopPropagation();
    // });
    //
    // $(".go-footer").click( function() {
    //     $('html,body').animate({ scrollTop: document.body.clientHeight }, 300);
    // });
});