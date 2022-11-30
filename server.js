//Setup Dependencies
const express = require('express');
// const cors = require(`cors`)
const app = express();
// const helmet = require('helmet')

//Setup App
const port = process.env.PORT || 3029;
// app.use(helmet());
// app.use(cors())
app.use(express.static("public"))

//Initialise App
app.listen(port, () => {
    console.log(`Fuzzy Search Web App is live @ ${port}`);
});

