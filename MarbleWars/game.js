let socket = io();
let screen = document.getElementById("screen");
let canvas = document.getElementById("game");
let context = canvas.getContext("2d");

let menu = document.getElementById("menu");
let entry = document.getElementById("entry");
let name_f = document.getElementById("name");
let join_b = document.getElementById("join");
let start_b = document.getElementById("start");
let players = document.getElementById("players");

// ローカル情報
let myToken = ""
let isJoinGame = false;
let isGM = false;

// 初期化
resizeCanvas()
// イベント関数
window.addEventListener("resize", resizeCanvas);

// socket.io接続＆Token取得
socket.on("token", function (token) {
    myToken = token;
    console.log(myToken)
});

// Joinボタン押下時
join_b.addEventListener("mousedown", function (e) {
    //e.preventDefault();
    if (isJoinGame == false) {
        socket.emit("join", { id: myToken, n: name_f.value });
        name_f.remove();
        join_b.remove();
        isJoinGame = true;
    }
})


// GameStartボタン押下時
start_b.addEventListener("mousedown", function (e) {
    socket.emit("game_start");
    console.log("game_start");
})

// プレイヤー参加時
socket.on("join_player", function (html) {
    players.innerHTML = html;
});

// ゲームマスター委任時
socket.on("setGM", function () {
    start_b.style.display = "block";
});

// ゲームスタート処理
socket.on("game_start", function () {
    if (isJoinGame == true) {
        menu.remove();
    }
    if (isJoinGame == false) {
        menu.innerHTML = "";
        menu.innerHTML += '<h1 id="title">MarbleWars</h1><h2 class="players">観戦中</h2><h2 class="player">しばらく待ってからリログしてください</h2> ';
    }
});

// 観戦モード処理
socket.on("observer", function () {
    menu.innerHTML = "";
    menu.innerHTML += '<h1 id="title">MarbleWars</h1><h2 class="players">観戦中</h2><h2 class="player">しばらく待ってからリログしてください</h2> ';
});


// アップデート処理
socket.on("update", function (world) {
     drawWorld(world)
});


// キャンパスのリサイズ
function resizeCanvas() {
    canvas.width = screen.clientWidth;
    canvas.height = screen.clientHeight;
}

// 描画
function drawWorld(world) {

    context.imageSmoothingEnabled = false;

    context.fillStyle = "rgba(233, 233, 233, 1)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (var i in world.player) {
        context.fillStyle = "rgba(0, 0, 255, 1)";
        context.fillRect(world.player[i].x, world.player[i].y, 10, 10);
    }
}
