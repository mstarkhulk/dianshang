$(function(){
  var currentPage = 1;

  var pageSize = 5;

  render();
  // 1. 一进入页面进行渲染
  function render(){
    $.ajax({
        type:'get',
        dataType:'json',
        url:'/category/querySecondCategoryPaging',
        data:{
           page:currentPage,
           pageSize:pageSize
        },
        success:function(info){
            console.log(info);
            var htmlStr = template("secondTpl",info);
            $('tbody').html(htmlStr);


            // 进行分页初始化
            $('#paginator').bootstrapPaginator({
               bootstrapMajorVersion: 3,
               currentPage: info.page,
               totalPags: Math.ceil(info.total / info.size ),
               onPageClicked: function(q,w,e,page){
                 currentPage = page;
                 render();
               }
            })
        }
    })    
  };



  // 2. 点击添加分类按钮, 显示添加模态框
  $('#addBtn').click(function(){
    $('#addModal').modal("show");

    // 请求一级分类名称, 渲染下拉菜单
    $.ajax({
      type:'get',
      dataType:'json',
      data:{
         page:1,
         pageSize:100
      },
      url:'/category/queryTopCategoryPaging',
      success:function(info){
        console.log(info);
        var htmlStr = template("dropdownTpl",info);
        $('.dropdown-menu').html( htmlStr );
      }
    })
  });



  // 3. 通过注册委托事件, 给 a 添加点击事件
  $('.dropdown-menu').on('click','a',function(){
    var txt = $(this).text();
    var id = $(this).data("id");

    // 修改文本内容
    $('#dropdownText').text( txt );


    // 将选中的 id 设置到 input 表单元素中
    $('[name="categoryId"]').val( id );

    // 需要将校验状态置成 VALID
    // 参数1: 字段
    // 参数2: 校验状态
    // 参数3: 配置规则, 来配置我们的提示文本
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });




  // 4. 进行文件上传初始化
  $('#fileupload').fileupload({
      dataType:'json',
      // 表示文件上传完成的回调函数
      done: function(e,data){
        console.log(data);
        // 获取文件上传的地址

        // 设置给 img 的 src

        // 将src路径, 实时设置给 input
        
        // 将 name="brandLogo" 的校验状态, 改成成功
      }
  })
  
  

})