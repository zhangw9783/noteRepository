const express = require('express');
const expressWs = require('express-ws');

const app = new express();
expressWs(app);

const wsClients = {}
app.wsClients = wsClients;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./static'));

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
});

app.ws('/ws/:wid',  (ws, req) => {
    if(!wsClients[req.params.wid]) {
        wsClients[req.params.wid] = []
    }
    // 将连接记录在连接池中
    wsClients[req.params.wid].push(ws);
    ws.on('message', (res) => {
        let data
        try {
            data = JSON.parse(res)
        } catch (e) {
            ws.send(JSON.stringify({content: '数据格式错误'}))
        }
        if (wsClients[res.to]) {
            wsClients[res.to].forEach(client => {
                client.send(JSON.stringify({from: res.from, content: res.content}))
            })
        } else {
            ws.send(JSON.stringify({content: '对方不在线'}))
        }
    })
    ws.onclose = () => {
        // 连接关闭时，wsClients进行清理
        wsClients[req.params.wid] = wsClients[req.params.wid].filter((client) => {
            return client !== ws;
        });
        if(wsClients[req.params.wid].length === 0) {
            delete wsClients[req.params.wid];
        }
    }
});

app.post('/rest/message', (req, res) => {
    const to = req.body.to; // 接收方id
    const from = req.body.from; // 发送发id
    const result = { succeed: true };
    if(wsClients[to] !== undefined) {
        wsClients[to].forEach((client) => {
            client.send(JSON.stringify({
                from,
                content: req.body.content
            }));
        });
    } else {
        // 如果消息接收方没有连接，则返回错误信息
        result.succeed = false;
        result.msg = '对方不在线';
    }
    res.json(result);
});

setInterval(() => {
    // 定时打印连接池数量
    console.log('websocket connection counts:')
    Object.keys(wsClients).forEach(key => {
        console.log(key, ':', wsClients[key].length);
    })
    console.log('-----------------------------');
}, 5000);

app.listen(3000, () => {
    console.log('visit http://localhost:3000');
    // child_process.execSync('start http://localhost:3000');
});
