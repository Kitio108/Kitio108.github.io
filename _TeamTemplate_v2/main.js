/*
// 画面切り替えのJavaScript

// JS要素の取得
let JSwarning = document.getElementById("JSwarning");
let topElem = document.getElementById("top");
let storyElem = document.getElementById("story");
let operationElem = document.getElementById("operation");
let staffElem = document.getElementById("staff");
let downloadElem = document.getElementById("download");

// 警告文非表示＆トップページ表示
JSwarning.style.display = "none";
topElem.style.display = "flex";

function clickTopBtn() {
    topElem.style.display = "flex";
    storyElem.style.display = "none";
    operation.style.display = "none";
    staffElem.style.display = "none";
    downloadElem.style.display = "none";
}

function clickStoryBtn() {
    topElem.style.display = "none";
    storyElem.style.display = "flex";
    operation.style.display = "none";
    staffElem.style.display = "none";
    downloadElem.style.display = "none";
}

function clickOperationBtn() {
    topElem.style.display = "none";
    storyElem.style.display = "none";
    operation.style.display = "flex";
    staffElem.style.display = "none";
    downloadElem.style.display = "none";
}

function clickStaffBtn() {
    topElem.style.display = "none";
    storyElem.style.display = "none";
    operation.style.display = "none";
    staffElem.style.display = "flex";
    downloadElem.style.display = "none";
}

function clickDownloadBtn() {
    topElem.style.display = "none";
    storyElem.style.display = "none";
    operation.style.display = "none";
    staffElem.style.display = "none";
    downloadElem.style.display = "flex";
}
*/