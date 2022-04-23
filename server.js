const express = require("express");
const app = express();
const port = 8080;

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});