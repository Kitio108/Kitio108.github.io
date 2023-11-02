function plusOne() {
    let element = document.querySelector('#modal');
    let currentNumber = Number(element.innerHTML);
    element.innerHTML = currentNumber + 1;
}

function plusFive() {
    let element = document.querySelector('#modal');
    let currentNumber = Number(element.innerHTML);
    element.innerHTML = currentNumber + 5;
}

function plusTen() {
    let element = document.querySelector('#modal');
    let currentNumber = Number(element.innerHTML);
    element.innerHTML = currentNumber + 10;
}