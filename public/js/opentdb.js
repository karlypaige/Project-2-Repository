var __otdb_token;

// Process response code when non-zero
function errCode(response_code) {
    let message;
    switch (response_code) {
        case 1: message = "No results"; break;
        case 2: message = "Invalid parameter"; break;
        case 3: message = "Token not found"; break;
        case 4: message = "Token empty"; break;
    }
    return new Error(message);
}

// Obtain a new token
function getNewToken() {
    $.get("https://opentdb.com/api_token.php?command=request")
        .then(res => {
            if (res.response_code === 0) {
                __otdb_token = res.token;
            }
            else {
                throw errCode(res.response_code);
            }
        })
}

// Get n questions
function getQuestions(n = 1, categoryId, difficulty) {
    let queryURL = `https://opentdb.com/api.php?amount=${n}&token=${__otdb_token}`;
    n = Math.min(Math.max(Math.floor(n), 1), 50);
    if (categoryId) {
        queryURL += "&category=" + categoryId;
    }
    if (difficulty) {
        queryURL += "&difficulty=" + difficulty;
    }
    return $.get(queryURL)
        .then(res => {
            if (res.response_code === 0) {
                return res.results;
            }
            else {
                throw errCode(res.response_code);
            }
        });
}

// Get a list of categories with IDs
function getCategories() {
    return $.get("https://opentdb.com/api_category.php")
        .then(res => res.json())
        .then(res => res.trivia_categories);
};

// Get question count data (optionally by category)
function getQuestionCount(categoryId) {
    let queryURL;
    if (categoryId) {
        queryURL = "https://opentdb.com/api_count.php?category=" + categoryId;
    }
    else {
        queryURL = "https://opentdb.com/api_count_global.php";
    }
    return $.get(queryURL)
        .then(res => res.overall || res.category_question_count);
}

getNewToken();
