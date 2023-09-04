const dotenv = require('dotenv').config();

const PORT = process.env.PORT;
const MANGODB_CONNECTION_STRING = process.env.MANGODB_CONNECTION_STRING;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFERSH_TOKEN_SECRET = process.env.REFERSH_TOKEN_SECRET;

module.exports = {
    PORT,
    MANGODB_CONNECTION_STRING,
    ACCESS_TOKEN_SECRET,
    REFERSH_TOKEN_SECRET
}