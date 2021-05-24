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
    res.push("/message", {method: 'GET'}).end(JSON.stringify({message: 'server push'}))
    res.end(`<html>
    <head></head>
    <body>
        <img src="/test.png" />
        <h1>Http2 api test</h1>
    <p>Get the message:</p>
    <button onClick="getmessage()">Get Message</button>
    <p id="msg"></p>
    <script>
        function getmessage() {
            let http = new XMLHttpRequest()
            http.onreadystatechange = () => {
                if (http.readyState === 4)
                    if (http.status == 200) {
                        let res = JSON.parse(http.responseText)
                        document.querySelector('#msg').textContent = "The message from the server is '"+res.message+"'."
                    }
            }
            http.open('get', 'https://localhost:3000/message', true)
            http.send()
        }
    </script>
    </body>
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