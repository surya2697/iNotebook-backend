const jwt=require("jsonwebtoken")
require('dotenv').config()

const fetchUser=async(req,res,next)=>{
    const token=req.header("auth-token")
    try {
        if(token){
            const data=await jwt.verify(token,process.env.secret_key)
            if(data){
                req.user=data.user
                next()
            }else{
                res.send({msg:"failed"})
            }
        }else{
            res.send({msg:"failed"})
        }
    } catch (error) {
        res.send(error.message)
    }
}

module.exports=fetchUser