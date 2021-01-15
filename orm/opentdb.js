const EventEmitter = require("events");
const fetch = require("node-fetch");

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

    reset() {
        this._getNewToken();
    }

    getQuestions(n = 1) {
        n = Math.min(Math.max(Math.floor(n), 1), 50);
        return fetch(`https://opentdb.com/api.php?amount=${n}&token=${this.token}`)
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

    _emitError(err) {
        this.emit("error", err);
    }
}

session.getCategories = function() {
    return fetch("https://opentdb.com/api_category.php")
        .then(res => res.json())
        .then(res => {
            if (res.response_code === 0) {
                return res.trivia_categories;
            }
            else {
                throw errCode(res.response_code);
            }
        });
};

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
        .then(res => {
            if (res.response_code === 0) {
                return res.overall || res.category_question_count
            }
            else {
                throw errCode(res.response_code);
            }
        });
}

module.exports = session;
