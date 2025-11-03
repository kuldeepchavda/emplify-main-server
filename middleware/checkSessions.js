
require("dotenv").config()
const jwt = require("jsonwebtoken")
const {getJWT, verifyJWT} = require("../config/JWT_opetations")
// check and response 
const verifySessions = async (req, res, next) => {
  const token  = req.cookies.user_token;
  if(!token){
    return res.status(402).json({verified:false, message:"token not provided!"})
  }
  
  const  verified =   verifyJWT(token, process.env.SESSION_SECRET)
  
  if (verified){
    res.status(200).json({verified:true, user:verified})
    console.log("validated!")
  }else{
    res.status(403).json({verified:false, message:"Not Verified"})
    console.log("!validated!") 
  }
};
// check and let go if not valid 
const validateSessions = async (req, res, next) => {
  const token  = req.cookies.user_token;

  if(!token){
    return res.status(402).json({verified:false, message:"token not provided!"})
  }
  
 const verified =   verifyJWT(token, process.env.SESSION_SECRET)
  if (verified){
    req.user  = verified    
    console.log("verified")
    return next()
    
  }else{
    res.status(403).json({verified:false, message:"Not Verified"})
    console.log("not verified!!")
  };
};

module.exports =  {validateSessions, verifySessions}