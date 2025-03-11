import { User } from "../models/user.model.js";
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
                return res.status(400).json({message: "user userName alredy existes"})
            }
            if (exisitedUser.email === email ) {
                console.log("this email alredy existes")
                return res.status(400).json({message: "user email alredy existes"})

            }
        }
    
        const hashPassword =await bcryptjs.hash(password, 10)
    
        const user = await User.create({
            userName: userName.toLowerCase(),
            fullName: fullName,
            email: email,
            password: hashPassword
        })

        if(!user) {
            console.log(500, "someting went wrong while registering user")
        }
        return res.status(201)
        .json({user: user,
            message: "user created sucessfully",  
        }
    )
       
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
         return res.status(400).json({message: "email is required"})
     }
    
     const user = await User.findOne({email})
     const ispasswordCorrect = await bcryptjs.compare(password, user.password)
 
     if(!(user || ispasswordCorrect)) {
         return res.status(400).json({message: "invalid email or password"})
     } 
     return res
     .status(200)
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
// const changedPassword = async (req, res) => {
//     try {
//         const {email, oldPassword, newPassword } = req.body;

//         if (!email || !oldPassword || !newPassword ) {
//            return res.status(400).json({message: "this fild are required: email, oldPassword, newPassword"})
//         }

//         const user = await User.findOne({email});
//         if(!user) {
//            return res.status(404).json({message: "something went wrong while user is not found"})
//         }

//         const ispasswordcorrect = await bcryptjs.compare(oldPassword, user.password);

//         if (!ispasswordcorrect) {
//            return res.status(400).json({message: "invalid old password", password:  user.password})
//         }

//          user.password = newPassword

//         await user.save({ validateBeforeSave: false })
//        return res.status(200).json({message: "password changed sucessfully"})
//     } catch (error) {
//        return res.status(500).json({message: error.message})

//     }
// }

const updateUser = async(req, res) => {
   try {
    //  const { userId } = req.params;
     const {userName, email, fullName} = req.body;
 
     if ([userName,email, fullName].some((fild) => !fild?.trim() === "")) {
         console.log("all filds are required")
         return res.status(400).json({message: "all filds are required"})
     }
     
     let updateUserDetails =  {
        userName,
        email,
        fullName,
        _id: req.params._id
     }

     updateUserDetails = await User.findByIdAndUpdate(req.params?._id, updateUserDetails)
    
     res.status(200)
     .json({
        user: updateUserDetails,
        message: "user details updated sucessfully"
     })
 
   } catch (error) {
    res.status(500).json({message: error.message})

   }

}

export{
    creatUser, 
    getAllUser,
    // changedPassword,
    updateUser,
    loginUser
}