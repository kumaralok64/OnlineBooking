const express = require('express');
const {handleUserSignup,handleSignIn,handleResetPass,handleImage} = require('../controllers/User');
const {User_Details} =require('../Middlewares/User')
const router = express.Router();

router.post('/signUp',handleUserSignup);
router.post('/signIn',handleSignIn);
router.post('/Password',handleResetPass);
router.get('/Details',User_Details);
router.get('/logout',(req,res)=>{
       res.clearCookie('user_token',{ httpOnly: true, secure: true });
      return res.send('Cookie has been cleared');
});
router.post('/img',handleImage);
module.exports = router;