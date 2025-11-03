const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs") 
const User = require("../config/DatabaseConfig").getCollection(process.env.USERS_DATABASE)

module.exports = (passport) => {
    passport.use("user_signup",
        new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },
        async function (req, email, password, done) {
                console.log("sd")
                try {
                    // CHECK IF ALL THE FIELDS ARE PROVIDED  
                    if (!email || !password) {
                        return done(null, false, { message: "All fields required" })
                    }

                    // CHECK IF USER EXISTS
                    const user = await User.findOne({ email })
                    if (user) {
                        return done(null, false, { message: "User Already Exists" })
                    }
                    // HASH AND SAVE
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(password, salt);

                    const createdUser = await User.create({ email, password: hashedPassword })
                     
                    return done(null, createdUser)
                } catch (error) {
                    console.log("Error-user", error.message);
                    done(error);
                }
            }
        )
    )
    passport.use("user_login",
        new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
        },
            async function (email, password, done) {
                try {
                    console.log(email, password);
                    console.log(0)
                    // CHECK IF ALL FIELDS PROVIDED 
                    if (!email || !password) {
                        done(null, false, { message: "All fields required." })
                    }
                    console.log(1)

                    // CHECK IF USER EXISTS 
                    const user = await User.findOne({ email });
                    // console.log(user);
                    console.log(user);
                    if (!user) {
                        console.log(email, "doesn't exist.");
                        return done(null, false, { message: "user doesn't exist." })
                    }
                    console.log(3)

                    const isMatched = await bcrypt.compare(password, user.password);
                    if (isMatched) {
                        console.log("user", user.email, "logged in")
                        return done(null, user)
                    }
                    console.log(4)

                    return done(null, false, { message: "Worng password" });
                    console.log(5)

                }
                catch (err) {
                    console.log("Error-user-login", err.message);
                    return done(err);
                }
            }
        ))
} 
