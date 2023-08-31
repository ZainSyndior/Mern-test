const express = require('express');
const dbConnect = require('./database/index');
const {PORT} = require('./config/index');
require('dotenv').config();
const router = require('./routes/index')
const errorHandler = require("./middleware/errorHandler")

const app = express();

app.use(router);

dbConnect();

app.use(errorHandler);

// app.get('/' , (req ,res) => res.json({msg: 'hello world 2'}));

app.listen(PORT , console.log(`backend is running on port: ${PORT}`));


