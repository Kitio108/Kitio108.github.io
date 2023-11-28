// 要素取得
let screen = document.getElementById('screen');
let canvas = document.getElementById('map');
let context = canvas.getContext('2d');

let map_urls_x = [ "/x-9", "/x-8", "/x-7", "/x-6", "/x-5", "/x-4", "/x-3", "/x-2", "/x-1", "/x0", "/x1", "/x2", "/x3", "/x4", "/x5", "/x6", "/x7", "/x8" ];
let map_urls_z = [ "/z-9", "/z-8", "/z-7", "/z-6", "/z-5", "/z-4", "/z-3", "/z-2", "/z-1", "/z0", "/z1", "/z2", "/z3", "/z4", "/z5", "/z6", "/z7", "/z8" ];

let onload_map_count = 0;
let maps = new Array(map_urls_x.length);
for (let i = 0; i < maps.length; i++) {
    maps[i] = new Array(map_urls_z.length);
    for (let j = 0; j < maps[i].length; j++) {
        maps[i][j] = new Image();
        maps[i][j].src = "https://maps.misskey.io/maps/world/tiles/1" + map_urls_x[i] + map_urls_z[j] + ".png?445683";
    }
}

//"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C://Chrome dev session"
// XMLHttpRequestを使ってjsonデータを読み込む
let hakodate_request = new XMLHttpRequest();
hakodate_request.open('GET', "hakodate.json");
hakodate_request.responseType = 'json';
hakodate_request.send();
let hakodate;
hakodate_request.onload = function () {
    hakodate = hakodate_request.response;
}



// パラメータ
let m_w = 300;
let m_h = 150;
let p_x = 0;
let p_y = 0;
let power = 1;
let t_power = 1;

let is_mouse_down = false;
let mouse_x = 0;
let mouse_y = 0;

// メイン処理 ここから ----------------------------------------------------------------

// キャンパス、マップ初期化
resizeCanvas();
for (let i = 0; i < maps.length; i++) {
    for (let j = 0; j < maps[i].length; j++) {
        maps[i][j].onload = function () {
            onload_map_count++;
            if (onload_map_count >= map_urls_x.length * map_urls_z.length) {
                drawMap();
                drawInfo();

                context.lineCap = "round";
                context.lineJoin = "round";
            }
        }
    }
}

// イベント関数
window.addEventListener("resize", resizeCanvas);
window.addEventListener("resize", drawMap);
window.addEventListener("resize", drawInfo);
window.addEventListener("mousedown", function (e) { is_mouse_down = true; console.log("クリック地点は x:" + Math.round((p_x + (e.clientX - m_w / 2) / power) * 10) / 10 + " z;" + Math.round((p_y + (e.clientY - m_h / 2) / power) * 10) / 10); });
window.addEventListener("mouseup", function (e) { is_mouse_down = false; });
window.addEventListener("mousemove", function (e) { moveMap(e); });
window.addEventListener("wheel", function (e) { powerMap(e); });

// メイン処理 ここまで ----------------------------------------------------------------

// キャンパスのリサイズ
function resizeCanvas() {
    canvas.width = screen.clientWidth;
    canvas.height = screen.clientHeight;
    m_w = screen.clientWidth
    m_h = screen.clientHeight;
    console.log("resizeCanvas");
}

// マップの描画
function drawMap() {

    context.imageSmoothingEnabled = false;
    for (let i = 0; i < maps.length; i++) {
        for (let j = 0; j < maps[i].length; j++) {
            context.drawImage(maps[i][j], 0, 0, 500, 500, (-500 * map_urls_x.length / 2 - p_x + 500 * i) * power + m_w / 2, (-500 * map_urls_z.length / 2 - p_y + 500 * j) * power + m_h / 2, 500 * power, 500 * power);
        }
    }
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillRect(0, 0, m_w, m_h);
    console.log("x:" + Math.round(p_x) + " y;" + Math.round(p_y) + " p:" + power);
}

// 情報描画
function drawInfo() {

    context.lineWidth = Math.min(4 * power, 8);
    context.font = "bold 24px 'YuGothic Medium'";
    context.textAlign = "center";
    context.textBaseline = "middle";

    for (let i = 0; i < hakodate.line.length; i++) {
        drawLine(hakodate.line[i].route, hakodate.line[i].main_color);
    }

    for (let i = 0; i < hakodate.line.length; i++) {
        for (let j = 0; j < hakodate.line[i].route.length; j++) {
            if (hakodate.line[i].route[j].length == 3) {
                drawSt("", hakodate.line[i].route[j][0], hakodate.line[i].route[j][1]);
            }
        }
    }

}

// マップ移動
function moveMap(e) {

    if (is_mouse_down == true) {
        p_x -= (e.clientX - mouse_x) / power;
        p_y -= (e.clientY - mouse_y) / power;
        moveClamp();

        drawMap();
        drawInfo();
    }
    mouse_x = e.clientX;
    mouse_y = e.clientY;
}

// マップ拡大縮小
function powerMap(e) {
    if (e.wheelDelta > 0 && t_power < 16) {
        t_power *= 2;
    }
    else if (e.wheelDelta < 0 && t_power > 0.25) {
        t_power *= 0.5;
    }
    powerAnm();
}

// マップ拡大縮小アニメーション
const powerAnm = () => {

    power = power * 19 / 20 + t_power * 1 / 20;
    //コールバック関数を繰り返す条件（必要に応じて設定）
    if (Math.abs(t_power - power) > 0.001) {
        //requestAnimationFrame() を使って自身（コールバック関数）を呼び出す（繰り返し）
        requestAnimationFrame(powerAnm);
    } else {
        power = t_power;
    }
    moveClamp();
    drawMap();
    drawInfo();
}

// マップ制限
function moveClamp() {
    if (p_x > 500 * map_urls_x.length / 2 - m_w / (2 * power)) {
        p_x = 500 * map_urls_x.length / 2 - m_w / (2 * power);
    }
    if (p_x < -500 * map_urls_x.length / 2 + m_w / (2 * power)) {
        p_x = -500 * map_urls_x.length / 2 + m_w / (2 * power);
    }
    if (p_y > 500 * map_urls_z.length / 2 - m_h / (2 * power)) {
        p_y = 500 * map_urls_z.length / 2 - m_h / (2 * power);
    }
    if (p_y < -500 * map_urls_z.length / 2 + m_h / (2 * power)) {
        p_y = -500 * map_urls_z.length / 2 + m_h / (2 * power);
    }
}

// 駅の描画
function drawSt(n, x, y) {

    s = Math.min(4 * power, 16);
    context.fillStyle = "rgba(0, 0, 0, 1)";
    context.fillRect((- p_x + x) * power + m_w / 2 - 2 * s, (- p_y + y) * power + m_h / 2 - 2 * s, 4 * s, 4 * s);
    context.fillStyle = "rgba(255, 255, 255, 1)";
    context.fillRect((- p_x + x) * power + m_w / 2 - s, (- p_y + y) * power + m_h / 2 - s, 2 * s, 2 * s);

    if (power >= 2) {
        context.lineWidth = 4;
        context.strokeStyle = "black";
        context.fillStyle = "white";
        context.strokeText(n, (- p_x + x) * power + m_w / 2, (- p_y + y) * power + m_h / 2, 200);
        context.fillText(n, (- p_x + x) * power + m_w / 2, (- p_y + y) * power + m_h / 2, 200);
    }

}

function drawLine(p, c) {

    context.beginPath();
    context.strokeStyle = "rgba(" + c[0] + ", " + c[1] + "," + c[2] + ", 1)";
    context.moveTo((- p_x + p[0][0]) * power + m_w / 2, (- p_y + p[0][1]) * power + m_h / 2);
    for (let i = 1; i < p.length; i++) {
        context.lineTo((- p_x + p[i][0]) * power + m_w / 2, (- p_y + p[i][1]) * power + m_h / 2);
    }
    context.stroke();
}