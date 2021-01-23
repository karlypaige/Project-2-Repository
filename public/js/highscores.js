const scoreListEl = $("#score-list");

$.get("/api/highscores")
    .then(scores => {
        let content;
        if (scores.length) {
            content = scores.map(score => `<li><span>${score.User.UserDetail.userName}</span><span class="float-right">${score.score}/10</span></li>`).join("\n");
        }
        else {
            content = "No scores yet!";
        }
        scoreListEl.append(content);
    });

$("#playagain").on("click", function () {
    window.location.replace("/trivia");
});

$("#mainmenu").on("click", function () {
    window.location.replace("/");
});
