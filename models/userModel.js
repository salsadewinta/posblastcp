const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    nip:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    tlp:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type:String,
        required:true
      },
    isVerified: { type: String, default: 0 },
    isOnline: { type: String, default: 0 } 
    },  
    {timestamps:true}
);

module.exports = mongoose.model('User', userSchema);