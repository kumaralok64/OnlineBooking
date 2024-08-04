const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const User_Model = require('../models/User');
const {GetToken} = require('./jwt');
const passport = require('passport');
passport.use(
    new GoogleStrategy({
    clientID:process.env.Goggle_ClientID, 
    clientSecret:process.env.Goggle_ClientSecretKey,
    callbackURL: `/api/auth/google/redirect`,
    scope:[ 'email', 'profile' ]
        },async(accessToken, refreshToken, profile, done)=>{
             try{
                     let user = await User_Model.findOne({
                        email:profile.emails[0].value
                    })
                    if(!user){
                        user =  await User_Model.create({
                            username:profile.displayName,
                            email:profile.emails[0].value,
                            image:profile.photos[0].value
                        })
                      
                    }
                    const payload ={username:user.username,image:user.image ,email:user.email};
                    const token = GetToken(payload);
                    console.log('user',user);

                    return done(null,{user,token}); //passing as object 
             }
             catch(err){
                console.log('Error while Connecting to goggleAuth',err);
                return done(null,err);
             }
        })
       )     

       
