// 1. 一进入页面, 发送 ajax 请求, 获取数据, 进行渲染
$(function(){
  var currentPage = 1;
  var pageSize = 5;
  render();

  function render(){
    // 发送ajax
    $.ajax({
      type:'get',
      dataType:'json',
      url:'/category/queryTopCategoryPaging',
      data:{
         page:currentPage,
         pageSize:pageSize
      },
      success:function(info){
        console.log(info);
        var htmlStr = template("firstTpl",info);
        $('tbody').html( htmlStr );
 
        // 分页初始化
        $('#paginator').bootstrapPaginator({
           bootstrapMajorVersion: 3,
           currentPage:info.page,
           totalPages:Math.ceil( info.total / info.size),
           onPageClicked:function(q,w,e,page){
             //更新当前页
             currentPage = page;
             //重新渲染
             render();
           }
        })
      }
   })
  };


  // 2. 点击添加按钮, 显示添加模态框
  $('#addBtn').click(function(){
    $('#addModal').modal("show")
  });


  // 3. 表单校验功能
  $('#form').bootstrapValidator({
      // 配置校验图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',    // 校验成功
        invalid: 'glyphicon glyphicon-remove',  // 校验失败
        validating: 'glyphicon glyphicon-refresh'  // 校验中
      },
      //字段列表
      fields:{
        categoryName:{
          //校验规则
          validators:{
            //非空
            notEmpty:{
              message:"请输入一级分类"
            }
          }
        }
      }
  });


  // 4. 注册表单校验成功事件, 阻止默认的提交, 通过ajax提交
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //ajax提交
    $.ajax({
      type:'post',
      dataType:'json',
      url:'/category/addTopCategory',
      data:$('#form').serialize(),
      success:function(info){
        console.log(info);
        if(info.success){
          $('#addModal').modal("hide");
          currentPage = 1;
          render();

          // 重置表单的内容和状态
          // resetForm( true ) 表示内容和状态都重置
          // resetForm()       表示只重置状态
          $('#form').data("bootstrapValidator").resetForm(true);
        }
      }
    })
  });
  
})

