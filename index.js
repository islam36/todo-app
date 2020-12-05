const express = require("express");
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
// app.use('view-engine', 'ejs');

app.listen(3000, () => {
    console.log("server running on http://localhost:3000");
})