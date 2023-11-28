function doFetch() {
    fetch("https://morimorihoge.github.io/teu2023f/tweets.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            let answerHtml = "<ul>";
            json.forEach(function (tweet) {
                answerHtml += `<li>${tweet.name}</li>`;
            });
            answerHtml += "</ul>";
            document.querySelector('#answer').innerHTML = answerHtml;
        });
}

function getNum() {
    fetch("https://zipcloud.ibsnet.co.jp/api/search?zipcode=3591145")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            let answerHtml = "<ul>";
            answerHtml += ("<li>" + json.results[0].address1 + "</li>");
            answerHtml += ("<li>" + json.results[0].address2 + "</li>");
            answerHtml += ("<li>" + json.results[0].address3 + "</li>");
            answerHtml += "</ul>";
            document.querySelector('#answer').innerHTML = answerHtml;
        });
}
