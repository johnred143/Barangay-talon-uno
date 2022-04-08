const express= require("express");
const app = express()

const port =  process.env.PORT || 5000;

app.get("/Account/login",(req,res)=>{

 return true ?  res.send("hello red"): res.send("hello world")



})
app.get("/Account/Register",(req,res)=>{
    let app = {
    
        username : "johnred",
        password : "mina",

    }// object
   console.log(app.username)
     return false ?  res.status(404).json() : res.status(200).json({ 
         success:true, 
         message:"invalid password"
     })
   
   
   
   })


app.listen(port, function(){

    console.log(`server started`)


})


