const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// salt를 이용해서 암호화
const saltRounds =10;

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50,
    },
    email:{
        type: String,
        trim: true,
        unique: 1
    },
    password:{
        type: String,
        minlength: 5
    },
    lastname:{
        type: String,
        maxlength: 50
    },
    role:{
        type: Number,
        default: 0
    },
    image: String,
    token:{
        type: String
    },
    tokenExp:{
        type: Number
    }
})

//index.js -> user pre save
userSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash){
                // Stroe hash in your password DB.
                if(err) return next(err);
                user.password = hash
                next();
            })
        })
    }
})
const User = mongoose.model('User', userSchema)

module.exports={User}