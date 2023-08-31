const Joi = require("joi");
const User = require('../models/user');

const authController = {
    
    async register(req,res,next){
        const userRegistrationSchema = Joi.object({
            name: Joi.string().max(50).required(),
            username: Joi.string().min(10).max(50).required(),
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
            const nameTaken = await User.exists({name});
            const passwordTaken = await User.exists({password});

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
        
    
    },
    async login (){}
}

module.exports = authController;