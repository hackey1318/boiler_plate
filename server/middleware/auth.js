const {User}=require('../models/User')
let auth = (req, res, next)=>{
    // process auth
    // get Token in client cookie
    let token = req.cookies.x_auth;
    //decrypt Token -> find user
    User.findByToken(token, (err, user)=>{
        if(err) throw err;
        //user -> Okay, !user -> No
        if(!user) return res.json({isAuth: false, error: true})
        req.token = token;
        req.user = user;
        next();
    })
    
}
module.exports={auth};