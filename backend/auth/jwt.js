const jwt = require('jsonwebtoken');
const Secret_Key = process.env.JWTSecret_key 

function GetToken(Details_User){
       return jwt.sign({
           Username: Details_User.username,
           image:Details_User.image,
           email:Details_User.email
        },Secret_Key,{expiresIn:'1h'});
}

function GetData(token){
    if(!token) return null;
    return jwt.verify(token,Secret_Key);
}

module.exports ={ GetToken , GetData};