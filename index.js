
require('dotenv').config()
const express=require("express")
const cors=require("cors")
const connection=require("./config/db")
const users = require('./routes/UsersRoute')
const notes = require('./routes/Notesroute')
const Port=process.env.Port
const app=express()
app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Welcome to the INOTEBOOK world")
})

app.use("/users",users)
app.use("/notes",notes)

app.listen(Port,()=>{
    connection()
    console.log(`Sever started on the port ${Port}`)
})