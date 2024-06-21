const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const session = require("express-session");
const controller = require("./src/main/controller/controller");
const env = require('dotenv');
// const FileStore = require('session-file-store')(session);

const PORT = process.env.PORT || 4000;
const PUBLIC = "public";
const VIEW = "src/main/views";
const HOME = "index.html";
const LOGIN = "pages/login.html";
const REGISTER = "pages/register.html";
const OTPLOGIN="pages/loginviaotp.html"
const SUPERADMIN = "pages/superAdmin.html";
const ADMIN = "pages/admin.html";
const CONSUMER="pages/consumer.html";
const TEST_VIEW = "src/main/views";
const TEST = "test.html";
const SAMPLE_DATA_VIEW = "src/main/views";
const SAMPLE_DATA_PAGE = "data.html";
const SAMPLE_DATA_FOLDER = "src/main/data/xml";
const sessionStore = "src/main/database/json-data/sessionStore.js"

env.config();
// start the session 
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
            expires: 60000*1*60*24*2      // 2 days expiry
        }
  })
);

// Serve static files (including CSS) from the public directory
app.use(express.static(path.join(__dirname, PUBLIC)));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());
// Parse URL-encoded bodies (usually for form data)
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON bodies (usually for JSON data)


//initialize passport 
app.use(controller.passport.initialize());
//integrate session with passport 
app.use(controller.passport.session());


// Define routes
app.get("/", (req, res) => {
    if(req.isAuthenticated()){
      if(req.user.role==="superAdmin"){
        res.sendFile(path.join(__dirname, VIEW, SUPERADMIN));
      }
    else 
    res.redirect(`/api/${req.user.role}-dashboard/user_${req.user.user_id.substr(5)}`)
  }
  else res.sendFile(path.join(__dirname, VIEW, HOME));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, VIEW, LOGIN));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, VIEW, REGISTER));
});
app.get("/loginviaotp",(req,res)=>{
  res.sendFile(path.join(__dirname,VIEW,OTPLOGIN))
})
// app.get("/superAdmin", (req, res) => {
//   res.sendFile(path.join(__dirname, VIEW, SUPERADMIN));
// });



// app.get("/admin",(req, res) => {
//   if (req.isAuthenticated()) {
//     if(req.user.role=="admin")
//     res.sendFile(path.join(__dirname, VIEW, ADMIN));
//     else res.sendStatus(403);
//   } else {
//     res.redirect("/login");
//   }
// });
// app.get("/consumer", (req, res) => {
//   if (req.isAuthenticated()) {
//     if(req.user.role=="consumer"){
//       res.sendFile(path.join(__dirname, VIEW, CONSUMER));
//     }
//       else {
//         res.sendStatus(403);
//   } 
// }else {
//     res.redirect("/login");
//   }                                                                                                                                                                                                                                                                                                      
// });
app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, TEST_VIEW, TEST));
});
// app.get("/sample", (req, res) => {
//   res.sendFile(path.join(__dirname, SAMPLE_DATA_VIEW, SAMPLE_DATA_PAGE));
// });

// app.get('/sample/download/:fileName', function(req, res) {
//   const fileName = req.params.fileName;
//   const filePath = path.join(__dirname, SAMPLE_DATA_FOLDER, fileName);

//   res.download(filePath, fileName, function(err) {
//     if (err) {
//       console.error('Error sending file:', err);
//       res.status(500).send('Error sending file');
//     } else {
//       console.log(`${fileName} sent successfully`);
//     }
//   });
// });

// google authentication routes
app.get("/auth/google",controller.passport.authenticate("google",{scope:["profile","email"]}))
app.get("/auth/google/callback",controller.passport.authenticate("google",{
    failureRedirect: "/login",
  }),(req,res)=>{
    if(req.user.role===undefined){
      res.redirect('/register');
    }
    else{
      res.redirect(`/`)
    }
    
  })
//for destroying the session and logging out
app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

// Start the server
require("./src/main/routes/api-routes")(app);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});