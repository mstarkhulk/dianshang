/**
 * Created by 54721 on 2018/11/18.
 */

mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005,  //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false //是否显示滚动条
  });
  
  
  
  // 此方法专门用于解析获取地址栏参数
  function getSearch ( k ) {
    // 获取地址栏参数信息
    var str = location.search;  // "?key=%E5%8C%A1%E5%A8%81&age=18&desc=%E5%B8%85"
  
    // 对中文解码
    str = decodeURI( str );    // "?key=匡威&age=18&desc=帅"
  
    // 去掉问号  str.slice(start, end); 包括start, 不包括end
    //          str.slice(start) 表示从start开始截取到最后
    str = str.slice( 1 );      // "key=匡威&age=18&desc=帅"
  
    // str.split( 字符 ); 可以将字符串切割成数组
    var arr = str.split( "&" );   //  ["key=匡威", "age=18", "desc=帅"]
  
    var obj = {};
  
    // 遍历数组, 取得键值对
    arr.forEach(function( v, i ) {   // v => "age=18"
      var key = v.split("=")[0];    // age
      var value = v.split("=")[1];  // 18
      obj[ key ] = value;
    })
  
    // 将需要获取的对应属性返回
    return obj[ k ];
  }
  