let axios = require('axios');
let proxy = require('express-http-proxy');

/**
   * @author G-shitou
   * 路由分发控制
   * restful API
   */
// let request = require('request');
// let axios = require('axios');

module.exports = function(app){
  // 请求页面index
  let entrance = require('./entrance.js');
  app.use('/',entrance);

  // 开始用express-http-proxy做转发,但是post会有问题，即使bodyContent改为对的格式还是不行,可能跟请求头有些关系，因时间关系具体原因未排查，具体参考注释代码
  // 正则匹配路由,由axios转发请求
  app.use(function(req, res, next) {
    let reg1 = /^\/pcapi\/.*$/g;
    let reg2 = /^\/api\/.*$/g
    let isPC = reg1.test(req.path);
    let isMobile = reg2.test(req.path);
    // 接口转发
    if(isPC || isMobile){
      // 接口,headers初始化
      var url = req.path,
          options = {};
      // url和headers设置
      if(isPC){
        options.url = 'https://u.y.qq.com' + url.replace('/pcapi','');
        options.headers = {"referer": "https://u.y.qq.com/","host" : 'u.y.qq.com'};
      }else{
        options.url = 'https://c.y.qq.com' + url.replace('/api','');
        options.headers = {"referer": "https://c.y.qq.com/","host" : 'c.y.qq.com'};
      }
      // 请求类型
      options.method = req.method;
      // 请求数据data
      if(req.method == 'POST'){
        let body = req.body;
        for(var i in body){
          options.data = JSON.parse(i);
          break;
        }
      }
      // params
      options.params = req.query || '';
      // 请求转发
      axios(options).then((response) => {
        res.json(response.data)
      }).catch((e) => {
        console.log(e)
      });
    };
  });

// app.use('/api', proxy('https://c.y.qq.com',{
//   https:true,
//   proxyReqOptDecorator:function(proxyReqOpts, srcReq) {
//     // 设置请求头
//     proxyReqOpts.headers['referer'] = 'https://c.y.qq.com/';
//     proxyReqOpts.headers['host'] = 'c.y.qq.com';
//     return proxyReqOpts;
//   }
// }));
// app.use('/pcapi', proxy('https://u.y.qq.com',{
//   https:true,
//   proxyReqBodyDecorator: function(bodyContent, srcReq) {
//     if(srcReq.method == 'POST'){
//       let content;
//       for(var i in bodyContent){
//         content = i;
//         break;
//       }
//       // content = JSON.parse(content);
//       console.log(content);
//       return content
//     }else{
//       return bodyContent;
//     }
//   },
//   proxyReqOptDecorator:function(proxyReqOpts, srcReq) {
//     proxyReqOpts.method = srcReq.method;
//     // 设置请求头
//     proxyReqOpts.headers['referer'] = 'https://u.y.qq.com/';
//     proxyReqOpts.headers['host'] = 'u.y.qq.com';
//     return proxyReqOpts;
//   }
// }));
}
