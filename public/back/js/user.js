
$(function() {

    // 一进入页面, 发送ajax请求, 获取数据, 进行页面动态渲染
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: 1,
        pageSize: 5
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        // 生成 htmlStr, 将来进行渲染
        // 参数1: 模板id, 参数2: 数据对象
        // 在模板中, 可以直接访问传进去对象中的所有属性
        var htmlStr = template("tmp", info );
  
        $('tbody').html( htmlStr );
      }
    })
  
  
  })
  