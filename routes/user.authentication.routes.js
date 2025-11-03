const router = require("express").Router()
const passport = require("passport")
const {getJWT}  = require("../config/JWT_opetations")

const {verifySessions} = require("../middleware/checkSessions.js")

router.route("/signup").post(async function (req,res,next) {
console.log("ewe");
    passport.authenticate("user_signup", (err, user, info)=>{

        if(err){
            console.log("Got an error while signing up user", info)
            res.status(201).json({message:info.message})
        }
        
        if(!user){
            return res.status(400).json({message:info.message})
        }
        
        const generatedToken = getJWT({email:user.email, _id:user._id})
        res.cookie("user_token",generatedToken,{
            httpOnly:true,
            secure:false,
            crossSite:"none",
            maxAge:1000*60*60
        })
        res.status(201).json({message:"Signed up"})
        console.log("message from auth user", user);


    })(req, res, next);
})



router.route("/login").post(async function (req,res,next){
    passport.authenticate("user_login",(err, user, info)=>{
        
        if(err){
            console.log("login Err", err.message)
            return res.status(401).json({message:err})
        }
        
        if(!user){
            console.log("not user")
            return res.status(401).json({message:info.message}) 
        }

        const generatedToken  = getJWT({email:user.email,_id:user._id})
        res.cookie("user_token",generatedToken,{
            httpOnly:true,
            secure:false,
            crossSite:"none",
            maxAge:1000*60*60
        });

        return res.status(201).json({message:"logged in"})
        })(req,res,next);
})


router.route("/logout").get(async function (req,res) {
    

    try{
        console.log("hitted")
        res.clearCookie("user_token");
        res.status(201).json({ message: "Logged out successfully." })  
    }
    catch(err){

    console.log(err.message)
    res.send("hey")
    }
})
router.route("/checksession").get(verifySessions);

module.exports  = router