// const express = require('express');
const {Schema} = mongoose;

const blogSchema = new Schema({
    title: {type: String , required: true},
    content: {type: String , required: true},
    photo: {type: String , required:true},
    author: {type: mongoose.SchemaTypes.ObjectId , ref: 'users' }

},
    {timestamps: true}
);

module.exports = mongoose.model('blog' , blogSchema , 'blogs' );