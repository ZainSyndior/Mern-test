const moongose = require('mongoose');
const {Schema} = moongose;

const refereshtokenSchema = new Schema({
    token: {type:String , required:true},
    tokenId: {type: moongose.SchemaTypes.ObjectId , ref:'users'}
},
 {timestamps: true}
);


module.exports = moongose.model('RefershToken' , refereshtokenSchema , 'tokens');