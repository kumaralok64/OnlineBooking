const express = require('express')
const passport = require('passport');
const authRoutes = express.Router();
const frontend_URL =  process.env.frontend_url;
authRoutes.get('/google',
    passport.authenticate('google', { scope:
        [ 'email', 'profile' ] }
  ));
  authRoutes.get('/google/redirect',
    passport.authenticate('google',{session: false }),
    (req,res)=>{ //req.user getting the userdata const {user,token} = req.user;
            if(req.user){
                res.cookie('user_token', req.user.token, { httpOnly: true, secure: true });
                res.redirect(`${frontend_URL}`);
            }else{
                res.redirect(`${frontend_URL}/User/Sign-in`);
            }
            
        }
  );
module.exports = authRoutes;

