const EventEmitter = require("events");
const { query } = require("express");
const fetch = require("node-fetch");

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



    _getNewToken() {
        fetch("https://opentdb.com/api_token.php?command=request")
            .then(res => res.json())
            .then(res => {
                if (res.response_code === 0) {
                    this.token = res.token;
                    this.emit("ready");
                }
                else {
                    this._emitError(new Error("Could not generate session token"));
                }
            })
            .catch(this._emitError);
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
                throw new Error("Could not get category list");
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
                let err = "Could not get question count";
                if (categoryId) {
                    err += " for category ID: " + categoryId;
                }
                throw new Error(err);
            }
        });
}

module.exports = session;
