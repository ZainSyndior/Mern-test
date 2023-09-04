const Joi = require("joi");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const userDTO = require('../dto/user');
const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
const JWTService = require('../services/JWTServices');
const RefreshToken = require('../models/tokens');
 
const authController = {
    
    async register(req,res,next){
        const userRegistrationSchema = Joi.object({
            name: Joi.string().max(50).required(),
            username: Joi.string().min(5).max(50).required(),
            email: Joi.string().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password')
        });

        const {error} = userRegistrationSchema.validate(req.body);
        
        if(error){
            return next(error);
        } 
        //check if user already registerd
        const {name,username,email,password} = req.body;
        try {
            const emailTaken = await User.exists({email});
            const usernameTaken = await User.exists({username});
            if(emailTaken){
                const error = {
                    status:409,
                    message: 'email already registerd use another email'
                }
                return next(error);
            }
            if(usernameTaken){
                const error = {
                    status:409,
                    message: 'Username already exist try another'
                }
                return next(error);
            }
        } catch (error) {
            return next(error);   
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let accessToken;
        let refreshToken;
        let user;
        try {
            const usertoRegister = new User({
                name,
                username,
                email,
                password: hashedPassword
            });
            user = await usertoRegister.save();
            accessToken = JWTService.signAccessToken({_id: user._id} , '30m'); 
            refreshToken = JWTService.signRefershToken({_id: user._id} , '60m'); 

            
        }
        catch (error) 
        {
          return next(error);   
        } 
        await JWTService.storeRefershToken(refreshToken, user._id)
        res.cookie('accessToken' , accessToken ,{
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });
        res.cookie('refreshToken' , refreshToken , {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        

        
        const userDto = new userDTO(user);
        return res.status(201).json({user: userDto , auth : true});
        
    
    },
    async login (req,res,next){
        const userLoginSchema = Joi.object ({
            username: Joi.string().min(5).max(50).required(),
            password: Joi.string().pattern(passwordPattern).required()
        })
        const {error} = userLoginSchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {username,password} = req.body;
        let user;
        try {
            user = await User.findOne({username});

            if(!user){
                const error = {
                    status:401,
                    message: 'Invalid username'
                }
                return next(error);
            }
            const matchPass = await bcrypt.compare(password, user.password);
            if(!matchPass){
                const error = {
                    status:401,
                    message: 'Invalid password'
                }
                return next(error);
            }
        } 
        catch (error) {
            return next(error);
        }
        let accessToken;
        let refreshToken;
        accessToken = JWTService.signAccessToken({_id:user._id} , '30m');
        refreshToken = JWTService.signRefershToken({_id:user._id} , '60m');
         try {
            
            await RefreshToken.updateOne({
                _id: user._id
            },
            {token: refreshToken},
            {upsert: true}
            );
         } 
         catch (error) 
         {
            return next(error);
         }
         
        res.cookie('accessToken' , accessToken ,{
            maxAge:1000* 60*60*24,
            httpOnly:true
        });
        res.cookie('refreshToken' , refreshToken,{
            maxAge:1000* 60*60*24,
            httpOnly:true
        });

        const userDto = new userDTO(user);
        return res.status(200).json({user: userDto , auth:true});
    },
    async logout(req,res,next){
        const {refreshToken} = req.cookie;
        try {
            await RefreshToken.deleteOne({token: refreshToken});

        } 
        catch (error) 
        {
            return next(error);
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');



        res.status(200).json({user: null , auth : false});

    }
}
module.exports = authController;