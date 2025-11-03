require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
// ROUTES
const userAuthRoutes = require("./routes/user.authentication.routes.js")
const jobRoutes = require("./routes/jobs.routes.js");
const ExperienceRoutes = require("./routes/users.routers/experience.router.js")
const {validateSessions} = require("./middleware/checkSessions.js");
const userRoutes = require("./routes/users.routers/users.routes.js")
const EducationRoutes = require("./routes/users.routers/education.router.js")
const JobApplicationRoutes = require("./routes/jobApplication.router.js")
const dbUtils = require("./config/DatabaseConfig")
// APP INITIATION 
const app = express()

//MIDDLEWARE
app.use(express.json());
app.use(cookieParser());    
const corsOptions = {
  origin: ['http://localhost:5173', 'https://placement-frontend-3sp7.onrender.com','https://placement-frontend-sepia.vercel.app','http://localhost:5174',"https://placement-main.vercel.app"],
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  credentials: true,
};

dbUtils.databaseConnect();
app.use(cors(corsOptions));


require("./config/passPortConfig")(passport)

// PASSPORT CONFIG  
app.use(passport.initialize());

// ROUTES 

app.use("/auth/user", userAuthRoutes);
app.use(validateSessions);
app.use("/user",userRoutes);
app.use("/job", jobRoutes);
app.use("/experience", ExperienceRoutes);
app.use("/education",EducationRoutes);
app.use("/apply",JobApplicationRoutes);


// START SERVER
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running at ${port}.`)
});

console.log(1);
console.log(2);
console.log(3);
console.log(4);
console.log(5);
console.log(6);
console.log(7);