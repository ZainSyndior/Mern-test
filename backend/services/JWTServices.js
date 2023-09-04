const jwt = require('jsonwebtoken');
const {ACCESS_TOKEN_SECRET , REFERSH_TOKEN_SECRET} = require('../config/index');
const RefreshToken = require('../models/tokens');

class JWTServices{
    //sign access token 
    static signAccessToken(payload, expiryTime){
        return jwt.sign(payload,ACCESS_TOKEN_SECRET ,{expiresIn:expiryTime});
    }
    //sign referesh token
    static signRefershToken(payload , expiryTime){
        return jwt.sign(payload,REFERSH_TOKEN_SECRET, {expiresIn: expiryTime});
    }
    //verify access token
    static verifyAccessToken(token){
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    }
    //verify refersh token
    static verifyRefereshToken(token){
        return jwt.verify(token,REFERSH_TOKEN_SECRET);
    }
    //store
    static async storeRefershToken(token,userid){
        try {
            const newToken = new RefreshToken({
                token: token,
                userid: userid,
            }); 
            await newToken.save();

        } 
        catch (error) {
            console.log(error);
        }
    }

}

module.exports = JWTServices;