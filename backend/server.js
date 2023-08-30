const express = require('express');
const dbConnect = require('./database/index');
const {PORT} = require('./config/index');
require('dotenv').config();

const app = express();

dbConnect();

// app.get('/' , (req ,res) => res.json({msg: 'hello world 2'}));

// app.listen(port , console.log(`backend is running on port: ${port}`));


