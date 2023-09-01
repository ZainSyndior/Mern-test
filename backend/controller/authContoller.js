const Joi = require("joi");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const userDTO = require('../dto/user');
const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
 
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

        const usertoRegister = new User({
            name,
            username,
            email,
            password: hashedPassword
        });

        const user = await usertoRegister.save();
        const userDto = new userDTO(user);
        return res.status(201).json({user: userDto});
        
    
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
        const userDto = new userDTO(user);
        return res.status(200).json({user: userDto});
    }
}
module.exports = authController;