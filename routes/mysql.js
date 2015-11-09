var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'xie',
  password : ''
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

//查询处理
var insertSQL = 'insert into test_1 set name="zhang",password=3454654;';   //增加用户
var selectSQL = 'select password from test_1 where name = "xie" ';         //密码查询
var deleteSQL = 'delete from test_1 where name = "xie"';
var updateSQL = 'update weather set password=1236543  where name="conan"';//修改密码

//天气数据插入
exports.add_user = function(up_date,data,callback){
  var insertSQL = "insert into weather set up_date='+up_date+',data='"+data+"';";
  connection.query(insertSQL, function(err, rows, fields) {
    if (err) console.log(err);
    for (var i in rows) {
      console.log(rows[i]);
    }
    callback(err,rows[0]);
  });
}