const port = 3000
const spdy = require('spdy')
const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()


app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By", ' 3.2.1')
    // res.header("Content-Type", "application/json;charset=utf-8")
    next();
});
app.use(express.static('./'))
app.get('/', (req, res) => {
    res.push("/test.png", {method: 'GET'}).end(fs.readFileSync('./test.png'))
    res.end(`<html>
    <head></head>
    <body><img src="/test.png" /></body>
    </html>`)
})

app.get('/message', (req, res) => {
    res.status(200).json({ message: 'message' })
})

const options = {
    key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
}

spdy.createServer(options, app).listen(port, err => {
    if (err) throw new Error(err)
    console.log("Listening at:", port);
})