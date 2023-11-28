var tweets = [];
fetch("https://morimorihoge.github.io/teu2023f/tweets.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        json.forEach(function (tweet) {
            tweets.push({ name: tweet.name, message: tweet.message, tweetedAt: tweet.tweetedAt, avatar: tweet.avatar });
        });
        AllTweets();
    });

function AllTweets() {
    var answer = "";
    tweets.forEach(function (tweet) {
        answer += formatTweet(tweet.name, tweet.message, tweet.tweetedAt, tweet.avatar);
    });
    document.querySelector('#tweets').innerHTML = answer;
}

function TaroTweets() {
    var answer = "";
    tweets.forEach(function (tweet) {
        if (tweet.name == "太郎") {
            answer += formatTweet(tweet.name, tweet.message, tweet.tweetedAt, tweet.avatar);
        }
    });
    document.querySelector('#tweets').innerHTML = answer;
}

function JiroTweets() {
    var answer = "";
    tweets.forEach(function (tweet) {
        if (tweet.name == "次郎") {
            answer += formatTweet(tweet.name, tweet.message, tweet.tweetedAt, tweet.avatar);
        }
    });
    document.querySelector('#tweets').innerHTML = answer;
}

function SabuTweets() {
    var answer = "";
    tweets.forEach(function (tweet) {
        if (tweet.name == "三郎BOT") {
            answer += formatTweet(tweet.name, tweet.message, tweet.tweetedAt, tweet.avatar);
        }
    });
    document.querySelector('#tweets').innerHTML = answer;
}

function formatTweet(name, message, tweetedAt, avatar) {
    var answer = "";
    answer += '<div class="tweet">';
    answer += '<img class="icon" src="' + avatar + '" alt="' + name + '">';
    answer += '<div class="content">';
    answer += '<div class="name-at">';
    answer += '<b>' + name + '</b>　' + tweetedAt;
    answer += '</div>';
    answer += '<div class="massage">';
    answer += message;
    answer += '</div>';
    answer += '</div>';
    answer += '</div>';
    return answer;
}
