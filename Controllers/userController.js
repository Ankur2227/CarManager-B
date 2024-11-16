const User = require("../Models/userModel");
const generateToken = require("../Config/generateToken");
const bcrypt = require("bcryptjs");

const authUser = async(req,res)=>{
    const {email, password} = req.body;
    try{
      const user = await User.findOne({email});
  
      if(user && (await bcrypt.compare(password, user.password)))
      {
          console.log(user);
          res.status(201).json({
              _id: user._id,
              name: user.name,
              email: user.email,
              pic: user.pic,
              token: generateToken(user._id),
          });
      }
      else{
          res.status(202).json({msg:"Invalid Email or Password!"});
          return;
      }
    }
    catch(err){
      res.status(401).json({msg:"Server Error!"})
    }
}

const registerUser = async(req,res)=>{
    // console.log(req.body);
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      res.status(202).json({msg:"Please Enter all the Fields"});
    }
  
    try{
      const userExists = await User.findOne({ email });
    
      if (userExists) {
        res.status(202).json({msg:"User already exists"});
      }
    
      const user = await User.create({
        name,
        email,
        password,
        pic,
      });
    
      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          token: generateToken(user._id),
      });
      } else {
        res.status(202).json({msg:"Something went worng!"});
      }
    }
    catch(error)
    {
      res.status(401).json({msg:"Server error"});
    }
}

module.exports = { authUser, registerUser};