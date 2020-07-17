<<<<<<< HEAD
const express = require('express')
const app = express()
const port = 5000
const config = require("./config/key")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {User} = require("./models/User")

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
// application/json
app.use(bodyParser.json())
app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURL,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=>console.log('MongoDB connected...'))
  .catch(err=>console.log(err))

app.get('/', (req, res) => res.send('Hello World!!Yes_Node.js world!!'))
app.post('/register', (req, res) => {
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
app.post('/login', (req,res)=>{
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
                res.cookie("x_AUTH", user.token)
                .status(200)
                .json({
                    loginSuccess: true,
                    userId: user._id
                })
            })
        })
    })
})

=======
const express = require('express')
const app = express()
const port = 5000
const config = require("./config/key")
const bodyParser = require('body-parser')
const {User} = require("./models/User")

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
// application/json
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURL,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=>console.log('MongoDB connected...'))
  .catch(err=>console.log(err))

app.get('/', (req, res) => res.send('Hello World!!Yes_Node.js world!!'))
app.post('/register', (req, res) => {
    // register information -> get client
    // into database
    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

>>>>>>> 8508196934b54792bc81f86e0a3846dbd3a4a49a
app.listen(port, () => console.log(`Example app listening at ${port}`))