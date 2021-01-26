$(document).ready(() => {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    var score = 0;
    var questArray = [];
    var quest = $("#questions");
    var message = $("#message");


    $("#play").on("click", function () {
        const diff = $("#difficulty").val();
        score = 0;
        getNewToken()
            .then(() => {
                getQuestions(10, undefined, diff)
                    .then(function (questions) {
                        message.empty()
                        questArray = questions;
                        renderQuestion();
                    })
            }
            );
    });

    function renderQuestion() {
        question = questArray.pop();

        if (question["type"] === "multiple") {
            //array to hold multiple choice answers for shuffling
            var answers = [];
            answers.push(question["correct_answer"]);
            answers.push(question["incorrect_answers"][0]);
            answers.push(question["incorrect_answers"][1]);
            answers.push(question["incorrect_answers"][2]);

            //shuffle the answers of the question
            answers = shuffleArray(answers);

            //display question and shuffled answers
            quest.html(`<p>${question["question"]}</p>
            <p><button class="answer">${answers[0]}</button></br>
            <button class="answer">${answers[1]}</button></br>
            <button class="answer">${answers[2]}</button></br>
            <button class="answer">${answers[3]}</button><p>`)
        } else if (question["type"] === "boolean") {
            //display true/false question and answers
            quest.html(`<p>${question["question"]}</p>
            <p><button class="answer">TRUE</button> 
            <button class="answer">FALSE</button></p>`)
        }
        else {
            // if(questions[i])
        };

        $(".answer").on("click", function (event) {
            console.log(event.target.textContent);
            if (event.target.textContent.toUpperCase() === question["correct_answer"].toUpperCase()) {
                // quest.empty();
                message.html(`<p id="right">"YOU ARE RIGHT"</p>`);
                
                score += 1;
            } else {
                message.html(`<p id="wrong">"NO!!"
                </br>the correct answer is ${question["correct_answer"]}</p>`);
            }

            //if more questions display the next one
            if (questArray.length != 0) {
                renderQuestion();
            } else {
                //display session score
                quest.html(`<p>"Your score is ${score}</p>`);

                //store scores in database
                storeScores(score);

            }
        })

    }

    function storeScores(newScore) {
        $.ajax("/api/myscores", {
            method: "post",
            data: {
                score: newScore
            }
        })
    };

    //function for shuffling an array
    function shuffleArray(array) {
        let curId = array.length;
        // There remain elements to shuffle
        while (0 !== curId) {
            // Pick a remaining element
            let randId = Math.floor(Math.random() * curId);
            curId -= 1;
            // Swap it with the current element.
            let tmp = array[curId];
            array[curId] = array[randId];
            array[randId] = tmp;
        }
        return array;
    }
});