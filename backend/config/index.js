const dotenv = require('dotenv').config();

const PORT = process.env.PORT;
const MANGODB_CONNECTION_STRING = process.env.MANGODB_CONNECTION_STRING;

module.exports = {
    PORT,
    MANGODB_CONNECTION_STRING
}