const mongoose=require("mongoose")
require('dotenv').config()
const connection=async()=>{
       try {
        await mongoose.connect(process.env.mongoURL)
        console.log("Succesfully connected to mongoDB")
       } catch (error) {
        console.log({description:"Something went wrong",error:error.message})
       }
}
module.exports=connection