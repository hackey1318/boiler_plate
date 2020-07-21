const express = require('express')
const app = express()
const port = 5000
const config = require("./config/key")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {User} = require("./models/User")
const {auth}=require("./middleware/auth")

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
// application/json
app.use(bodyParser.json())
app.use(cookieParser)

const mongoose = require('mongoose')
mongoose.connect(config.mongoURL,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=>console.log('MongoDB connected...'))
  .catch(err=>console.log(err))
// Express Router -> /api/user/login, /api/product/create, /api/comment
app.get('/', (req, res) => res.send('Hello World!!Yes_Node.js world!!'))
app.get('/api/hello',(req,res) => res.send("Hello world!!"))
app.post('/api/users/register', (req, res) => {
    // register information -> get client
    // into mongo database
    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})
app.post('/api/users/login', (req,res)=>{
    // find Email in DataBase
    User.findOne({email:req.body.email}, (err,user)=>{
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다!!"
            })
        }
        // correct Password in DataBase
        user.comparePassword(req.body.password,(err, isMatch)=>{
            if(!isMatch){
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다. 다시 입력해 주시기 바랍니다."
                })
            }
            // make Token
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                // save Token
                // where -> Cookie, Local Storage, Session...
                // choose Cookie
                res.cookie("x_auth", user.token,{
                    httpOnly: true
                })
                .status(200)
                .json({
                    loginSuccess: true,
                    userId: user._id
                })
            })
        })
    })
})
//auth midware
app.get('/api/users/auth', auth ,(req, res)=>{
    // middleware Complete -> Authentication (True)
    res.status(200).json({
        _id: req.user._id,
        // role 0 : guest
        // role !0 : admin
        isAdmin: req.user.role === 0 ? false : true,    //chage role num
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout',auth,(req,res)=>{
    User.findOneAndUpdate({_id: req.user._id},
        {token: ""},
        (err, user)=>{
        if(err) return res.json({success: false, err})
        return res.status(200).send({
            success: true
        })
    })
})
app.listen(port, () => console.log(`Example app listening at ${port}`))