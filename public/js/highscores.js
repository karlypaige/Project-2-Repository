const scoreListEl = $("#score-list");

$.get("/api/highscores")
    .then(scores => {
        let content;
        if (scores.length) {
            content = scores.map(score => `<li>${score.score}<span class="float-right">${score.email}</span></li>`).join("\n");
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
