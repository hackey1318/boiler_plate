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
}).then(()=>console.log('MongoDB Connected...')).catch(err=>console.log(err))

app.get('/', (req, res) => res.send('Hello World_node.js!!'))

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


app.listen(port, () => console.log(`Example app listening at ${port}`))