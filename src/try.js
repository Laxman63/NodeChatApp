const express=require('express');
app=express();
port=process.env.PORT || 3000;
app.get('/',(req,res)=>{
    res.send("jiiii")
})
app.listen(port,(req,res)=>{
console.log("laxm");
})