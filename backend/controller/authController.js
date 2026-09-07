const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

exports.registerUser = async (req, res)=>{
    const { name, email, password } = req.body;
    try{
        if(!name || !email || !password){
            res.status(400).json({ message: "Please enter all fields!" });
        }

        const userExists = await User.findOne({ email });
        if(userExists){
            res.status(400).json({ message: "User already exists!" });
        }

        const user = await User.create({ name, email, password });
        if(user){
            res.status(201).json({
                message: "User created successfully!",
                token: generateToken(user._id),
            });
        }else{
            res.status(400).json({ message: "Invalid user data!"});
        }
    }
    catch(err){
        res.status(500).json({ message: "Server Error"});
        console.error(err);
    }
};

exports.loginUser = async (req, res)=>{
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email }).select("+password");
        if(user && (await user.matchPassword(password))){
            return res.json({
                message: "Login Successful",
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        }else{
             return res.status(401).json({ message: "Invalid Credentials!" });
        }
    }
    catch(err){
        res.status(500).json({ message: "Server Error"});
        console.log(err);
    }
};

exports.getProfile = async (req, res)=>{
    try{
        const user = await User.findById(req.user.id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isPro: user.isPro,
        });
    }
    catch(err){
        res.status(500).json({ message: "Server Error"});
    }
};

exports.updateProfile = async (req, res)=>{
    try{
        const user = await User.findById(req.body.id);
        if(user){
            user.name = req.body.name || user.name;
            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
            });
        }else{
            res.status(404).json({ message: "User not found!" })
        }
    }
    catch(err){
        res.status(500).json({ message: "Server Error"});
    }
};