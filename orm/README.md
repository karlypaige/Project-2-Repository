# opentdb

Example:
```js
const OpenTDB = require("./orm/opentdb");

OpenTDB.getCategories() // Get category list with IDs
    .then(console.log)
    .catch(console.error);

let session = new OpenTDB();

session.on("ready", function() { // Wait for session
    session.getQuestions(5, 9) // 5 questions from "General Knowledge" (id: 9)
        .then(console.log);
});
session.on("error", console.error);
```
