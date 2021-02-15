
const express = require('express')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')
const db = require('./dbTools')

const server = express()
const router = express.Router()

// let heros = []

//路由
router.get('/', (req, res, next) => {
  db.find('heros',{},function(err,heros){
    res.render('index', { heros })//属性
  })
})
  //添加
  .post('/add', (req, res, next) => {
    const form = formidable({ multiples: true });

    //修改上传目录
    form.uploadDir = path.join(__dirname, 'public', 'imgs')
    //保持原有后缀名
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
      console.log(files);
      console.log(fields);//fields.nickname ,fields.avatar.path
      let nickname = fields.nickname
      let filename = path.parse(files.avatar.path).base;
      let img = 'imgs/' + filename;
      // heros.push({
      //   nickname,
      //   img
      // })
      //保存数据
      db.insert('heros', { nickname, img }, function (err, result) {
        if (err) return next(err);
        //同步提交浏览器等待页面显示rediect原路径
        res.redirect('/')
      })
      // res.writeHead(200, { 'content-type': 'application/json' });
      // res.end(JSON.stringify({ fields, files }, null, 2));
    });

  })
  //最后一个路由，访问不存在的路径
  .all('*', (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' })
    res.end('地址错误了')
  })

server.engine('.html', require('express-art-template'))

//render配套使用
server.set('view engine', '.html')

//静态类似vue的public静态文件
server.use(express.static('./public'))
//路由
server.use(router)
//处理错误页面
server.use((err, req, res, next) => {
  res.send('<h1>你访问的页面不存在，返回首页</h1>')
})

server.listen(3000)
