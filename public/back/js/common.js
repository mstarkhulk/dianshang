// 进度条
// 开启进度条
//NProgress.start();
//
//setTimeout(function() {
//  // 关闭进度条
//  NProgress.done();
//}, 500)



// 需求: 在第一个ajax请求时, 开启进度条
//       在所有的ajax请求都回来后, 关闭进度条

// ajax全局事件
// .ajaxComplete()  当每个ajax完成时调用,  (不管成功还是失败, 都调用)
// .ajaxSuccess()   当每个ajax成功响应时调用
// .ajaxError()     当每个ajax失败响应时调用
// .ajaxSend()      当每个ajax准备要发送前, 会调用ajaxSend

// .ajaxStart()     当第一个ajax请求发送时调用
// .ajaxStop()      当所有的ajax请求完成时调用
$(document).ajaxStart(function (){
    NProgress.start();
});

$(document).ajaxStop(function (){
    setTimeout(function(){
        NProgress.done();
    },5000);
});



// jquery 入口函数, 等待 dom 结构加载完成之后, 就执行
$(function() {

    // 公共的功能
    // 功能1: 导航点击切换功能
    $('.lt_aside .category').click(function() {
      // 让下一个兄弟元素切换显示隐藏
      $(this).next().stop().slideToggle();
    });
  
    // 功能2: 左侧菜单列表切换功能
    $(".lt_topbar .icon_left").click(function() {
  
      $('.lt_aside').toggleClass("hidemenu");
  
      $('.lt_main').toggleClass("hidemenu");
  
      $('.lt_topbar').toggleClass("hidemenu");
  
    })

  // 功能3: 退出功能
  $('.lt_topbar .icon_right').click(function() {
    // 点击按钮, 显示模态框
    // $('#modal').modal("show") // 显示
    // $('#modal').modal("hide") // 隐藏
    $('#logoutModal').modal("show");
  });

  // 模态框的按钮点击事件
  $('#logoutBtn').click(function() {

    // 发送ajax请求, 让后台销毁当前用户的登录状态
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function( info ) {
        console.log( info );
        if ( info.success ) {
          // 退出成功
          location.href = "login.html";
        }
      }
    });


  })

})