const express = require('express');
const authController = require('../controller/authContoller');
const { route } = require('express/lib/application');
const router = express.Router();
//test
router.get('/test', (req,res) => res.json({msg: 'Working'}));

//login

router.post('/login' , authController.login );

//register

router.post('/register' , authController.register);



module.exports = router;
