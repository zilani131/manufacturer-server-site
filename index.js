const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const express = require('express');
const cors=require('cors');

require('dotenv').config();
const app = express();
const port = process.env.PORT||5000;
app.use(cors());
app.use(express.json());
// user : manufacture_zilani
// pw: Hub1HeEUkgGJiGqy


const uri = "mongodb+srv://manufacture_zilani:Hub1HeEUkgGJiGqy@cluster0.z3wp7.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const toolsCollection=client.db("manufacture").collection("tools");
        // tools collection
        app.get('/tools',async (req,res)=>{
            const query={};
            
            const tools =await toolsCollection.find(query).toArray();
            res.send(tools);
        })
        // purchase tool api
        app.get('/purchase/:_id',async (req,res)=>{
            const _id=req.params._id;
            const query={_id:ObjectId(_id)}
            const tool=await toolsCollection.findOne(query)
            res.send(tool)
        })
    }
    finally{
        
    }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("manufacturer")
})
app.listen(port,()=>{
    console.log(`listening manufacturer from port ${port}`)
})