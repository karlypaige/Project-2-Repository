$(document).ready(() => {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    var score = 0;

    $("#play").on("click", function () {
        const diff = $("#difficulty").val();

        getQuestions(undefined, undefined, diff)

            .then(function (questions) {
                var quest = $("#questions")
                console.log(questions)
                
                quest.empty();

                if (questions[0]["type"] === "multiple") {
                    //array to hold multiple choice answers for shuffling
                    var answers = [];
                    
                    answers.push(questions[0]["correct_answer"]);
                    answers.push(questions[0]["incorrect_answers"][0]);
                    answers.push(questions[0]["incorrect_answers"][1]);
                    answers.push(questions[0]["incorrect_answers"][2]);
                    console.log(answers);
                    //shuffle the answers of the question
                    answers = shuffleArray(answers);
                    console.log(answers);

                    quest.html(`<p>${questions[0]["question"]}</p>
            <p><button class="answer">${answers[0]}</button>
            <button class="answer">${answers[1]}</button>
            <button class="answer">${answers[2]}</button>
            <button class="answer">${answers[3]}</button><p>`)
                } else if (questions[0]["type"] === "boolean") {
                    quest.html(`<p>${questions[0]["question"]}</p><p><button class="answer">TRUE</button> <button class="answer">FALSE</button></p>`)
                }
                else {
                };

                $(".answer").on("click", function (event) {
                    console.log(event.target.textContent);
                    if (event.target.textContent.toUpperCase() === questions[0]["correct_answer"].toUpperCase()) {
                        // quest.empty();
                        quest.html(`<p>"YOU ARE RIGHT"</p>`);
                        score += 1;
                    } else {
                        quest.html(`<p>"NO!!"</p>`);
                    }
                })



            })

    });

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