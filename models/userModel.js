const mongoose =require("mongoose")


const userSchema = new mongoose.Schema({
   username:{
    type:String,
    unique:true,
    require:[true,"user must have a username"]
   },

   password:{
    type:String,
    require:[true,"user must have a password"]
   },
})

const User = mongoose.model("user",userSchema)

module.exports = User;