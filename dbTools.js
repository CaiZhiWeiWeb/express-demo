const MongoClient = require('mongodb').MongoClient;

// Connection url

const url = 'mongodb://localhost:27017';

// Database Name

const dbName = 'test';

// Connect using MongoClient
function _connect(callback) {
  MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    // Create a collection we want to drop later
    callback(client)
  });
}
//增删改查都需要调用连接函数获取对象
let obj = {}
//cname是集合collections

//插入数据
obj.insert = function (cname, arrData, fn) {
  _connect(function (client) {
    const col = client.db(dbName).collection(cname);
    col.insert(arrData, function (err, result) {
      fn(err, result)
      client.close()
    });
  })
}

//查询
obj.find = function (cname, filter, fn) {
  _connect(function (client) {
    const col = client.db(dbName).collection(cname);
    col.find(filter).toArray(function (err, documents) {
      fn(err, documents)
      client.close()
    })
  })
}

//更新
obj.update = function (cname, filter, updated, fn) {
  _connect(function (client) {
    const col = client.db(dbName).collection(cname);
    col.update(filter, { $set: updated }, function (err, result) {
      fn(err, result)
      client.close()
    });
  })
}

//删除
obj.delete = function (cname, filter, fn) {
  _connect(function (client) {
    const col = client.db(dbName).collection(cname);
    col.deleteMany(filter,function (err, result) {
      fn(err, result)
      client.close()
    });
  })
}


// obj.insert('test01', [{ name: 'jack' }, { name: 'rose' }], function (err,result) {
//   if (err) throw err
//   console.log(result);
// })

// obj.find('test01', { name: 'jack' }, function (err, users) {
//   if (err) throw err
//   console.log(users);
// })

// obj.update('test01', { name: 'jack' },{ name: 'mark' }, function (err, users) {
//   if (err) throw err
//   console.log(users);
// })
// obj.delete('test01', { name: 'jack' }, function (err, users) {
//   if (err) throw err
//   console.log(users);
// })

//   // Insert a bunch of documents

module.exports = obj;
