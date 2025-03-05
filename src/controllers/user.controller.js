import { User } from "../models/user.model";
import bcryptjs from "bcryptjs"


const creatUser =async (req, res) => {
    try {
        const {userName, fullName, email, password} = req.body;
    
        if ([userName, fullName, email, password].some((fild) => {fild?.trim() === ""})) {
            console.log("this fild are required")
        }
    
        const exisitedUser = await User.findOne({
            $or: [{userName}, {email}]
        })
    
        if (exisitedUser) {
            if (exisitedUser.userName === userName) {
                console.log("this userName alrady exists")
            }
            if (exisitedUser.email === email ) {
                console.log("this email alredy existes")
            }
        }
    
        const hashPassword =await bcryptjs.hash(password,10)
    
        const user = await User.create({
            userName: userName.toLowerCase(),
            fullName: fullName,
            email: email,
            password: hashPassword
        })

        if(!user) {
            console.log(500, "someting went wrong while registering user")
        }

        res.status(201)
        .json({user: user,
            message: "user created sucessfully"
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

const getAllUser = async (req, res) => {
    try {
        const user = await User.find({})
        res.status(200)
        .json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const loginUser = async (req, res) => {
   try {
     const { email, password} = req.body
 
     if(!email) {
         console.log("email is required")
     }
    
     const user = await User.findOne({email})
 
     const ispasswordCorrect = await bcryptjs.compare(password, user.password)
 
     if(!user || !ispasswordCorrect) {
         return req.status(400).json({message: "invalid email or password"})
     } 
 
     res.status(200)
     .json({
         message: "user logged in successfully",
         user: {
             _id: user._id,
             fullName: user.fullName,
             email: user.email
         }
     })

 
   } catch (error) {
    res.status(500).json({message: error.message})

   }
 }
const changedPassword =async (req, res) => {
    try {

        const user = await User.findOne({password})
        const {oldPassword, newPassword} = req.body

        const isPasswordCorrect = await bcryptjs.compare(oldPassword, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).res.json({message: "invalid old password"})
        }

        user.password = newPassword
        await user.save({validateBeforeSave: false})

        res.status(200).json({message: "password changed sucessfully"})
    } catch (error) {
        res.status(500).json({message: error.message})

    }
}

const updateUser = async(req, res) => {
   try {
     const {userName, email, fullName} = req.body
 
     if ([userName,email, fullName].some((fild) => !fild?.trim() === "")) {
         console.log("all filds are required")
     }
 
     const user = await User.findByIdAndUpdate(req.params?._id, {
         userName,
         email,
         fullName,
         _id:req.params._id
     })

     res.status(200)
     .json({
        user: user,
        message: "user details updated sucessfully"
     })
 
   } catch (error) {
    res.status(500).json({message: error.message})

   }

}

export{
    creatUser, 
    getAllUser,
    changedPassword,
    updateUser,
    loginUser
}