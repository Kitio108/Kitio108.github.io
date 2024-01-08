// cd \C_TUT\Web\GitHubPages\MarbleWars
// npm run dev

console.log("nodejs");

var http = require("http");
var fs = require("fs");
var url = require("url");
var io = require('socket.io')(http);
var html = fs.readFileSync("game.html");
var css = fs.readFileSync("style.css");
var js = fs.readFileSync("game.js");
var PORT = 8000;

var server = http.createServer((req, res) => {

    const url_parts = url.parse(req.url);
    console.log(url_parts.pathname);

    switch (url_parts.pathname) {
        case '/':
        case '/game.html':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(html);
            res.end();
            break;
        case '/style.css':
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(css);
            res.end();
            break;
        case '/game.js':
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write(js);
            res.end();
            break;
        default:
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('お探しのページは見つかりません。');
            break;
    }
});

server.listen(PORT, () => {
    console.log("server runnning!");
});

var io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:8000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});




// ゲームクラス部 --------------------------------

class World {

    constructor() {
        this.player = [];
        console.log("Create World");
    }

    AllPlayerMove(d) {
        this.player.forEach(p => p.move(d));
    }
}

class Player {
    constructor(id, name, x, y) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;

        this.vx = 10;
        this.vy = 0;

        console.log("Create Player");
    }

    move(d) {
        this.x += this.vx / d
        this.y += this.vy / d
    }
}

// ワールド操作部

let world = new World();
let isGameStart = false;
let gameMaster = "";

// 繋がっている最中
io.on("connection", function (socket) {

    // 再起動が必要なら再起動
    if (world.player.length == 0) {
        isGameStart = false;
    }


    // トークン送信
    console.log("User Connection : " + socket.id);
    io.to(socket.id).emit("token", socket.id);
    if (isGameStart == false) {
        sendPlayerName();
    } else {
        io.to(socket.id).emit("observer", socket.id);
    }

    // プレイヤー参加処理
    socket.on("join", function (data) {
        let newPlayer = new Player(data.id, data.n, 100, 100);
        world.player.push(newPlayer);
        sendPlayerName();
    });

    // プレイヤー退出時処理
    socket.on("disconnect", () => {
        for (var i in world.player) {
            if (world.player[i].id == socket.id) {
                world.player.splice(i, 1);
            }
        }
        sendPlayerName();
    });

    // ゲームスタート
    socket.on("game_start", function (){
        isGameStart = true;
        io.emit("game_start");
        console.log("s");
    });

});

// 周期的処理
setInterval(() => {

    if (isGameStart == true) {

        world.AllPlayerMove(60.0);

        io.emit("update", world);
    }

}, 1000 / 60.0);

function sendPlayerName(){
    let players_html = '<h2 class="players">- Players -</h2>'
    for (var i in world.player) {
        players_html += '<h2 class="player">' + world.player[i].name
        if (i == 0) {
            players_html += ' (GM)'
        }
        players_html += '</h2>'
    }
    io.emit("join_player", players_html);

    if (world.player.length > 0) {
        if (gameMaster != world.player[0].id) {
            io.to(world.player[0].id).emit("setGM");
            gameMaster = world.player[0].id;
        }
    }
}