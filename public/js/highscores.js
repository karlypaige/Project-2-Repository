$.get("/api/highscores")
    .then(scores => {
        let content;
        if (scores.length) {
            content = scores.map(score => `<li><span>${score.User.UserDetail.userName}</span><span class="float-right">${score.score}/10</span></li>`).join("\n");
        }
        else {
            content = "No scores yet!";
        }
        $("#score-list").append(content);
    });
