const express = require('express');
const cors=require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT||5000;
app.use(cors());
app.use(express.json());
// user : manufacture_zilani
// pw: Hub1HeEUkgGJiGqy
app.get('/',(req,res)=>{
    res.send("manufacturer")
})
app.listen(port,()=>{
    console.log(`listening manufacturer from port ${port}`)
})