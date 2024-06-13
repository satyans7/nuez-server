const roleAuthenticatorIdSensitive = (requiredRole) => {
  return (req, res, next) => {
    if(req.user.email=== "admin@nueztpl.co.in" || req.user.email==="superadmin@nueztpl.co.in") 
      next();
    if(requiredRole==="consumer" && req.user.role==="admin"){
      next();
    };
    if(requiredRole===req.user.role){
        
      let user_id=req.user.user_id;
      let id = req.params.id;
     
     let isauthorized=false;
     if(requiredRole===req.user.role && user_id.substr(5)===id){
       isauthorized=true;
     }
     if(isauthorized)
     next();
     else res.status(401).json({message:"unauthorized"})
    }
    
    
    
  };
};
const roleAuthenticatorIdInSensitive = (requiredRole) => {
  return (req, res, next) => {
    if(req.user.email=== "admin@nueztpl.co.in" || req.user.email==="superadmin@nueztpl.co.in") 
      next();
    if(requiredRole==="consumer" && req.user.role==="admin"){
      next();
    };
    if(requiredRole===req.user.role){
      next();
    }
     else res.status(401).json({message:"unauthorized"})
    }
    
    
    
  };


module.exports = {roleAuthenticatorIdSensitive,roleAuthenticatorIdInSensitive};