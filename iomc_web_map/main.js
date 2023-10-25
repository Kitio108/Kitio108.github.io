// 要素取得
var screen = document.getElementById('screen');
var canvas = document.getElementById('map');
var context = canvas.getContext('2d');

var map_urls_x = ["/x-6", "/x-5", "/x-4", "/x-3", "/x-2", "/x-1", "/x0", "/x1", "/x2", "/x3", "/x4", "/x5"];
var map_urls_z = ["/z-6", "/z-5", "/z-4", "/z-3", "/z-2", "/z-1", "/z0", "/z1", "/z2", "/z3", "/z4", "/z5"];

var onload_map_count = 0;
var maps = new Array(map_urls_x.length);
for (i = 0; i < maps.length; i++) {
    maps[i] = new Array(map_urls_z.length);
    for (j = 0; j < maps[i].length; j++) {
        maps[i][j] = new Image();
        maps[i][j].src = "https://maps.misskey.io/maps/world/tiles/1" + map_urls_x[i] + map_urls_z[j] + ".png?445683";
    }
}




// XMLHttpRequestインスタンスを作成
let request = new XMLHttpRequest();
// JSONファイルが置いてあるパスを記述
request.open("GET", "./data.json");
request.send();



// パラメータ
var m_w = 300;
var m_h = 150;
var p_x = 0;
var p_y = 0;
var power = 1;
var t_power = 1;

var is_mouse_down = false;
var mouse_x = 0;
var mouse_y = 0;

// メイン処理 ここから ----------------------------------------------------------------

// キャンパス、マップ初期化
resizeCanvas();
for (i = 0; i < maps.length; i++) {
    for (j = 0; j < maps[i].length; j++) {
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

window.addEventListener("mousedown", function () { is_mouse_down = true; });
window.addEventListener("mouseup", function () { is_mouse_down = false; });
window.addEventListener("mousemove", function (e) { moveMap(e);});
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
    for (i = 0; i < maps.length; i++) {
        for (j = 0; j < maps[i].length; j++) {
            context.drawImage(maps[i][j], 0, 0, 501, 501, (-501 * map_urls_x.length / 2 - p_x + 501 * i) * power + m_w / 2, (-501 * map_urls_z.length / 2 - p_y + 501 * j) * power + m_h / 2, 501 * power, 501 * power);
        }
    }
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillRect(0, 0, m_w, m_h);
    console.log("x:" + p_x + " y;" + p_y + " p:" + power);
}

// 情報描画
function drawInfo() {

    context.lineWidth = Math.min(8*power,8);

    drawLine([[0, 0], [136, 342], [-577, 470]]);

    drawSt(0, 0);
    drawSt(136, 342);
    drawSt(-577, 470);

    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.fillStyle = "white";
    context.font = "bold 48px 'YuGothic'";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("iomcだいたいあってる路線図　Webバージョン", 20, 20, 1200);
    context.strokeText("iomcだいたいあってる路線図　Webバージョン", 20, 20, 1200);
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
    else if (e.wheelDelta < 0 && t_power > 0.5)
    {
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
    if (p_x > 501 * map_urls_x.length / 2 - m_w / (2 * power)) {
        p_x = 501 * map_urls_x.length / 2 - m_w / (2 * power);
    }
    if (p_x < -501 * map_urls_x.length / 2 + m_w / (2 * power)) {
        p_x = -501 * map_urls_x.length / 2 + m_w / (2 * power);
    }
    if (p_y > 501 * map_urls_z.length / 2 - m_h / (2 * power)) {
        p_y = 501 * map_urls_z.length / 2 - m_h / (2 * power);
    }
    if (p_y < -501 * map_urls_z.length / 2 + m_h / (2 * power)) {
        p_y = -501 * map_urls_z.length / 2 + m_h / (2 * power);
    }
}

// 駅の描画
function drawSt(x, y) {

    s = Math.min(8 * power, 8);
    context.fillStyle = "rgba(0, 0, 0, 1)";
    context.fillRect((- p_x + x) * power + m_w / 2 - 2 * s, (- p_y + y) * power + m_h / 2 - 2 * s, 4 * s, 4 * s);
    context.fillStyle = "rgba(255, 255, 255, 1)";
    context.fillRect((- p_x + x) * power + m_w / 2 - s, (- p_y + y) * power + m_h / 2 - s, 2 * s, 2 * s);
}

function drawLine(p) {

    context.beginPath();
    context.strokeStyle = "red";
    context.moveTo((- p_x + p[0][0]) * power + m_w / 2, (- p_y + p[0][1]) * power + m_h / 2);
    for (i = 1; i < p.length; i++) {
        context.lineTo((- p_x + p[i][0]) * power + m_w / 2, (- p_y + p[i][1]) * power + m_h / 2);
    }
    context.stroke();
}