var express = require('express');
var router = express.Router();
var urllib = require('urllib');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//天气查询
router.get('/city',function(req,res,next){
  var city = encodeURIComponent(req.query.city);//转码
  console.log(city,'44')
  urllib.request('http://apis.baidu.com/heweather/weather/free?city='+city, {
    method: 'get',
    headers: {
      'apikey': 'bb38cc59dc943c0d474fd8df6c423a3f',//百度接口
    }
  }, function (err, data) {
    if (err) {
      throw err; // you need to handle error
    }
    var results = data.toString();
    console.log(results);
    res.send(results);//给客户端返回一个json格式的数据
  });
});

module.exports = router;
