const { GetData } = require('../auth/jwt');

 function User_Details(req, res){
      
            const token =  req?.cookies?.user_token;
            if (!token) { return null}
            const token_Data = GetData(token);
            if (!token_Data) {
                return res.status(401).json({ message: "Invalid Token" });
              }
            return res.json(token_Data);
}

async function Details(req, res, next) {
  const token = req?.cookies?.user_token;
  if (!token) {
      return res.status(401).json({ message: "Please Login to Your Account" });
  }

  const token_Data = GetData(token);

  // If token is invalid, return a 401 Unauthorized response
  if (!token_Data) {
      return res.status(401).json({ message: "Invalid Token" });
  }

  
  req.user = token_Data;

 
  next();
}


module.exports = { User_Details ,Details}
