function log(str) {
    console.log("引数str: " + str);
}

function threeLog(str1, str2, str3) {
    console.log("１個目: " + str1);
    console.log("２個目: " + str2);
    console.log("３個目: " + str3);
}

function defaultLog(str, defaultStr = "default") {
    console.log("デフォルト値あり: " + str);
    console.log("デフォルト値なし: " + defaultStr);
}

function product_2021_1010() {
    return 2021 * 1010;
}

function product(a, b) {
    return a * b;
}

function productOnesPlace(a, b) {
    return a * b % 10;
}

function productTensPlace(a, b) {
    return parseInt(a * b % 100 / 10);
}

function logHello() {
    console.log("Hello");
}