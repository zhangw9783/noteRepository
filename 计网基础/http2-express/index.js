const port = 3000
const spdy = require('spdy')
const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //第二个参数,是一个*号,表示任意域名下的页面都可以都可以请求请求这台服务器;   
    //设置指定域名:   
    //res.header("Access-Control-Allow-Origin", "http://baidu.com");    
    //这样,baidu.com下面的网页,就可以ajax请求你的服务器了    
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    //第二个参数,为对方可以以哪种HTTP请求方式请求你的服务器,根据自己的情况酌情设置    
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


app.get('/message', (req, res) => {
    res.status(200).json({ message: 'message' })
})

app.get('*', (req, res) => {
    res.status(200).json({ message: 'ok' })
})

const options = {
    key: fs.readFileSync(path.resolve(__dirname, './server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, './server.crt'))
}

spdy.createServer(options, app).listen(3000, err => {
    if (err) throw new Error(err)
    console.log("Listening at:", 3000);
})