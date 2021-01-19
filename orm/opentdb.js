const EventEmitter = require("events");
const fetch = require("node-fetch");

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

// New session with token
class session extends EventEmitter {
    constructor(options = {}) {
        super();
        this.encoding = options.encoding;
        if (options.token) {
            this.token = token;
            this.emit("ready");
        }
        else {
            this._getNewToken();
        }
    }

    // Get a new token for this instance
    reset() {
        this._getNewToken();
    }

    // Get n questions
    getQuestions(n = 1, categoryId, difficulty) {
        let queryURL = `https://opentdb.com/api.php?amount=${n}&token=${this.token}`;
        n = Math.min(Math.max(Math.floor(n), 1), 50);
        if (categoryId) {
            queryURL += "&category=" + categoryId;
        }
        if (difficulty) {
            queryURL += "&difficulty=" + difficulty;
        }
        if (this.encoding) {
            queryURL += "&encode=" + this.encoding;
        }
        return fetch(queryURL)
            .then(res => res.json())
            .then(res => {
                if (res.response_code === 0) {
                    return res.results;
                }
                else {
                    this._emitError(errCode(res.response_code));
                }
            })
            .catch(err => this._emitError(err));
    }

    // Internal method to obtain a new token and emit 'ready'
    _getNewToken() {
        fetch("https://opentdb.com/api_token.php?command=request")
            .then(res => res.json())
            .then(res => {
                if (res.response_code === 0) {
                    this.token = res.token;
                    this.emit("ready");
                }
                else {
                    this._emitError(errCode(res.response_code));
                }
            })
            .catch(err => this._emitError(err));
    }

    // Internal method to emit an error
    _emitError(err) {
        this.emit("error", err);
    }
}

// Get a list of categories with IDs
session.getCategories = function() {
    return fetch("https://opentdb.com/api_category.php")
        .then(res => res.json())
        .then(res => res.trivia_categories);
};

// Get question count data (optionally by category)
session.getQuestionCount = function(categoryId) {
    let queryURL;
    if (categoryId) {
        queryURL = "https://opentdb.com/api_count.php?category=" + categoryId;
    }
    else {
        queryURL = "https://opentdb.com/api_count_global.php";
    }
    return fetch(queryURL)
        .then(res => res.json())
        .then(res => res.overall || res.category_question_count);
}

module.exports = session;
