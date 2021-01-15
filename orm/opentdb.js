const EventEmitter = require("events");
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
            })
            .catch(this._emitError);
    }

    _emitError(err) {
        this.emit("error", err);
    }
}

session.getCategories = function() {
    
};

module.exports = session;
