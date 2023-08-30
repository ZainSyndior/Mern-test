const mongoose = require('mongoose');
const {MANGODB_CONNECTION_STRING} = require('../config/index');
const connectionString = "mongodb+srv://support:coinbase@cluster0.dr3psd1.mongodb.net/sam";

const dbConnect =  async () =>{
    try {
        const conn = await mongoose.connect(connectionString);
        console.log(`Database is connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}
module.exports = dbConnect;
