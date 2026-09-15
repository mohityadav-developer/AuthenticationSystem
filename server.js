import express from "express"
import mongoose from "mongoose"
import User from "./models/userschema.js"
import config from "./config/config.js"
import authrouter from "./routes/authroute.js"
import cookieParser from "cookie-parser"
 mongoose.connect(config.MONGO_URI).then(()=>{
    console.log("Database connected successfully")
 }).catch(()=>{
    console.log("There is some error in connecting to database")
 })


const app = express()
const port = 3000
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authrouter)





app.get('/', (req, res) => {
    res.send("hello ")
  });
  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




