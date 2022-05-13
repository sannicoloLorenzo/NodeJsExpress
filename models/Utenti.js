const mongoose = require('mongoose')

const UserSchema=new mongoose.Schema({
    nome:String,
    password:String,
    role:String
})

const User=mongoose.model('User',UserSchema);

module.exports=User;