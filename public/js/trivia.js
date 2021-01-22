$(document).ready(() => {
      // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page

  $("#play").on("click", function(){
    const diff = $("#difficulty").val();

    getQuestions(undefined, undefined, diff)

    .then(function(questions){
        var quest = $("#questions")
        quest.empty();
        console.log(questions)
        if(questions[0]["type"]==="multiple"){
            quest.html(`<p>${questions[0]["question"]}</p>
            <p><button class="answer">${questions[0]["correct_answer"]}</button>
            <button class="answer">${questions[0]["incorrect_answers"][0]}</button>
            <button class="answer">${questions[0]["incorrect_answers"][1]}</button>
            <button class="answer">${questions[0]["incorrect_answers"][2]}</button><p>`)
        }else if(questions[0]["type"]==="boolean"){
            quest.html(`<p>${questions[0]["question"]}</p><p><button class="answer">TRUE</button> <button class="answer">FALSE</button></p>`)
        }
        else{

        };
        
        $(".answer").on("click", function(event){
            console.log(event.target.textContent);
            if(event.target.textContent===questions[0]["correct_answer"]){
                // quest.empty();
                quest.html(`<p>"YOU ARE RIGHT"</p>`);
            } else {
                quest.html(`<p>"NO!!"</p>`);
            }
        })
        


    })

  });

});