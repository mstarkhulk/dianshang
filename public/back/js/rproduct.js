$(function(){
    var currentPage = 1;
    var pageSize = 3;
    var picArr = [];  // 存储所有用于上传的图片对象
  
    // 1. 一进入页面, 发送请求, 渲染页面
    render();
    function render(){
      $.ajax({
        type:'get',
        dataType:'json',
        url:'/product/queryProductDetailList',
        data:{
          page:currentPage,
          pageSize:pageSize
        },
        success:function(info){
            console.log(info);
            
              var htmlStr = template("productTpl",info);
              $('tbody').html( htmlStr );
            // 进行分页初始化
            $('#paginator').bootstrapPaginator({
               bootstrapMajorVersion: 3,
               totalPages:Math.ceil(info.total / info.size),
               currentPage:info.page,
               onPageClicked:function(q,w,e,page){
                   //更新当前页
                   currentPage = page;
                   render();
               }
            })
        }
      })
    }
  
  
    // 2. 点击添加按钮, 显示添加模态框
    $('#addBtn').click(function(){
      $('#addModal').modal("show");
  
      // ajax发送请求所有的二级分类数据并渲染
      $.ajax({
          type:'get',
          url: "/category/querySecondCategoryPaging",
          data: {
              page: 1,
              pageSize: 100
            },
          dataType:'json',
          success: function ( info ) {
              console.log( info );
              // 结合模板引擎渲染
              var htmlStr = template("dropdownTpl", info);
              $('.dropdown-menu').html( htmlStr );
            }
      })
    });
  
  
    // 3. 通过事件委托, 给所有dropdown里面的 a 添加点击事件
    $('.dropdown-menu').on("click", "a", function() {
      // 获取文本, 设置给按钮
      var txt = $(this).text();
      $('#dropdownText').text( txt );
  
      // 获取 id, 设置给隐藏域
      var id = $(this).data("id");
      $('[name="brandId"]').val( id );
  
      // 将校验状态, 改成 VALID
      $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
    });
  
  
    // 4. 进行文件上传配置
    $('#fileupload').fileupload({
        dataType:'json',
        // 文件上传完成的回调函数
        done:function( e, data ){
            console.log(data);
            
            var picObj = data.result;  // 后台返回的结果  (图片名称/图片地址)
            var picUrl = picObj.picAddr;  // 图片地址
  
            // 往数组的最前面追加
            picArr.unshift(picObj);
  
           // 结构上, 往最前面追加 
           $('#imgBox').prepend('<img src="'+ picUrl +'" style="height:100px" alt="">')
           
           if(picArr.length > 3 ){
            // 将最前面的保留, 将最后面移除,
            // 移除数组最后一项
            picArr.pop();
            // 移除图片结构中最后一个图片, 找最后一个图片类型的元素, 进行删除, 让他自杀
            $('#imgBox img:last-of-type').remove()
           }
  
           if(picArr.length === 3){
            // 说明文件上传满 3 张了, picStatus 状态应该更新成 VALID
            $('#form').data("bootstrapValidator").updateStatus("picStatus","VALID");
           }
        }
    });
  
  
  
  
      //使用表单校验插件
      $('#form').bootstrapValidator({
          // 配置排序项, 默认会对隐藏域进行排除, 我们需要对隐藏域进行校验
          excluded: [],
      
          // 配置校验图标
          feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',    // 校验成功
            invalid: 'glyphicon glyphicon-remove',  // 校验失败
            validating: 'glyphicon glyphicon-refresh'  // 校验中
          },
  
          // 配置校验字段
          fields:{
              brandId: {
                  validators: {
                    notEmpty: {
                      message: "请选择二级分类"
                    }
                  }
                },
  
            proName:{
              validators:{
                notEmpty:{
                  message: "请输入商品名称"
                  }
               }
            },
  
            proDesc: {
              validators: {
                notEmpty: {
                  message: "请输入商品描述"
                }
              }
            },
  
            num:{
              validators:{
                notEmpty:{
                  message:"请输入商品库存数量"
                },
  
            // 正则校验, 非零开头的数字
            // \d =>  数字 0-9
            // * 表示出现 0 个 或 多个
            // ? 表示出现 0 个 或 1个
            // + 表示出现 1 个 或 多个
            // {m,n} 从 m 个 到 n 个
            regexp:{
                regexp:/^[1-9]\d*$/,
                message:'请输入非零开头的数字'
            }
              }
            },
  
            size: {
              validators: {
                notEmpty: {
                  message: "请输入尺码"
                },
                // 校验需求: 必须是 xx-xx 的格式,  xx两位数字
                regexp: {
                  regexp: /^\d{2}-\d{2}$/,
                  message: '必须是 xx-xx 的格式,  xx两位数字'
                }
              }
            },
  
            oldPrice: {
              validators: {
                notEmpty: {
                  message: "请输入商品原价"
                }
              }
            },
  
            price: {
              validators: {
                notEmpty: {
                  message: "请输入商品现价"
                }
              }
            },
  
                  // 专门用于标记文件上传是否满 3张 的
        picStatus: {
          validators: {
            notEmpty: {
              message: "请上传3张图片"
            }
          }
        }
  
      }
    });
  
    // 6. 注册表单校验成功事件, 阻止默认的提交, 通过 ajax 提交
    $('#form').on("success.form.bv", function( e ) {
      e.preventDefault();
  
      var params = $('#form').serialize();  // 获取所有 input 中的数据
  
      console.log( picArr );
      // 还要加上图片的数据
      // params += "&picName1=xx&picAddr1=xx"
      params += "&picName1=" + picArr[0].picName +"&picAddr1=" + picArr[0].picAddr;
      params += "&picName2=" + picArr[1].picName +"&picAddr2=" + picArr[1].picAddr;
      params += "&picName3=" + picArr[2].picName +"&picAddr3=" + picArr[2].picAddr;
  
      $.ajax({
        type: "post",
        url: "/product/addProduct",
        data: params,
        dataType: "json",
        success: function( info ) {
          console.log( info );
          if ( info.success ) {
            // 关闭模态框
            $('#addModal').modal("hide");
            // 重新渲染第一页
            currentPage = 1;
            render();
            // 重置内容和状态
            $('#form').data("bootstrapValidator").resetForm(true);
  
            // 重置下拉按钮 和 图片内容
            $('#dropdownText').text("请选择二级分类");
            $('#imgBox img').remove();
            // 清空数组
            picArr = [];
          }
        }
      })
  
    })
  
  
  });