const env = require('dotenv');
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const dbController=require("../db-controller/db-controller")
env.config();

//  The strategy makes a session of user 
passport.use("google",new GoogleStrategy({
  
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"http://nuez-smart.utkalinga.com/auth/google/callback",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo" 
  } ,async(accessToken,refreshToken,profile,cb)=>{
      try {
      let name = profile.given_name;
      if(profile.family_name!=undefined){
        name +=` ${profile.family_name}`;
      }
      let user={
              user_id:"",
              name:name,
              email:profile.email,
              role:""
          }
          let result=await dbController.findUserByEmail(user.email);
            if(result!==({})){
              user.role=result.role;
              user.user_id=result._id;
            }
            return cb(null,user);
        } catch (err) {
          return cb(err);
        }
      }
  ));
  

  //for creating the cookies with user data
passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  
  //for  fetching the details of user from cookie
passport.deserializeUser((user, cb) => {
    cb(null, user);
  });

module.exports = passport;

  