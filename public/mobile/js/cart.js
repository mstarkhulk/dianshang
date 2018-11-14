/**
 * Created by Jepson on 2018/8/13.
 */
$(function() {

  render();

  // 1. 进入页面, 发送ajax请求, 获取购物车列表, 进行渲染
  function render() {
    $.ajax({
      type: "get",
      url: "/cart/queryCart",
      dataType: "json",
      success: function( info ) {
        console.log( info );
        if ( info.error === 400 ) {
          // 用户没登陆, 跳转到登录页, 在跳转时, 将页面地址拼接
          location.href = "login.html?retUrl=" + location.href;
          return;
        }

        // 用户已登录, 通过模板引擎渲染  (需要的是对象, 要将数组包装)
        var htmlStr = template( "cartTpl" , { arr: info } );
        $('.lt_main .mui-table-view').html( htmlStr );
      }
    });
  }


});
