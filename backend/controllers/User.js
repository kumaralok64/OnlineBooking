const User_Model = require('../models/User');
const bcrypt = require('bcryptjs');
const {GetToken} = require('../auth/jwt');
async function handleUserSignup( req,res){
   try{
      const {username , email ,password} = req.body;
      if(!username || !email || !password) throw new Error('Please Enter the required Credentials');
       const Existing_User = await User_Model.findOne({
          email:email
       })
       if(!Existing_User){
        const salt = bcrypt.genSaltSync(5);
        const hashpassword =  await bcrypt.hashSync(password, salt);
         if(!hashpassword)  throw new Error('Something went wrong');
          await User_Model.create({
              ...req.body,
              password:hashpassword
          })
          return res.status(201).json({
           sucess:true,
           error:false,
           message:"User created Sucessfully"
          })
       }
  
         throw new Error('User Already exist');
   }

   catch(err){
      return res.status(400).json({
         sucess:false,
         message:err.message || err,
         error:true,

        });
   }
    

  

}
async function handleSignIn(req,res){
      try{
         const {email ,password} = req.body;
         if(!email || !password) throw new Error('Please Enter the Login Credentials');

      const User_Exist =   await  User_Model.findOne({
            email
         });
         if(!User_Exist) throw new Error('No Account Exist');
         const IsSignUpwith_Goggle = User_Exist.password;
         if(!IsSignUpwith_Goggle) throw new Error('Account Exist, But Password Not Set');
         const check_Password =  await bcrypt.compare(password, IsSignUpwith_Goggle);
         if(!check_Password) throw new Error('Enterd Wrong Password');
           
           const payload = {username: User_Exist.username, image:User_Exist.image,email:User_Exist.email};
           const token = GetToken(payload);

           if(!token)  throw new Error('Error While Creating Token');

            res.cookie('user_token',token,{ httpOnly: true, secure: true });
            console.log('user_token', token);
            return res.status(201).json(
               {
               sucess:true,
               error:false,
               message:"Login Sucessfully"
            })
      }catch(err){
         return res.status(400).json({
            sucess:false,
            message:err.message || err,
            error:true
   
           });
      }
}
async function handleResetPass(req,res){
           try{
            const {email ,password} = req.body;
            if(!email || !password) throw new Error('Please Enter the required Credentials');
         const salt = bcrypt.genSaltSync(5);
         const hashpassword =  await bcrypt.hashSync(password, salt);
         if(!hashpassword)  throw new Error('Something went wrong');
            const Exisiting_User = await User_Model.findOneAndUpdate({
               email
            },{
            password:hashpassword
            }  )
            if(!Exisiting_User) throw new Error('No Account Exist');
            return res.status(201).json(
               {
               sucess:true,
               error:false,
               message:"Reset Password Sucessfully"
            })
           }
           catch(err){
            return res.status(400).json({
               sucess:false,
               message:err.message || err,
               error:true
      
              });
           }
}
 const handleImage = async(req,res)=>{
  try{
         const {email, image} = req.body;
         await User_Model.findOneAndUpdate({
            email:email
         },{
            image:image
         })
         return res.status(201).json(
            {
            sucess:true,
            error:false,
            message:"image set Succesfully"
         })
  }catch(err){
   return res.status(400).json({
      sucess:false,
      message:err.message || err,
      error:true

     });
  }


}

module.exports = {handleUserSignup , handleSignIn ,handleResetPass,handleImage};