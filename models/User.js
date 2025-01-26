import mongoose from "mongoose";

const {Schema}=mongoose;

const userSchema=new Schema({
    fullname: String,
    email: String,
    password: String,
    isAdmin: { type: String, default: false },
    isVerified: { type: String, default: false },

});

const User=mongoose.model('User',userSchema);

export default User;