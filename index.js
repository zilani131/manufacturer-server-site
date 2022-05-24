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
        const profilesCollection=client.db("manufacture").collection("user");
        const detailsCollection=client.db("manufacture").collection("userDetails");
        const reviewsCollection=client.db("manufacture").collection("reviews");
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
        // 
        // update quantity
        app.put('/purchase/:_id',async(req,res)=>{
            const _id=req.params._id;
            const newQuantity = req.body.newQuantity;
            console.log(newQuantity)
            const filter={_id:ObjectId(_id)};
            const options = { upsert: true };
            const updateDoc={
                $set: {
                    quantity:newQuantity,
                  },
            }
            const result = await toolsCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        // geting user order list 
        app.get('/user',async(req,res)=>{
            const email=req.query.email;
            const query={email:email};
            const result = await profilesCollection.find(query).toArray();
            res.send(result);
        })
        // user reviews getting 
        app.get('/reviews',async(req,res)=>{
            const query={};
            const result=await reviewsCollection.find(query).toArray();
            res.send(result)
        })
        // save details
        app.post('/userdetails',async(req,res)=>{
            
            const profile=req.body;
            console.log(profile)
            const result = await detailsCollection.insertOne(profile);
            res.send(result)
        })
        // user information 
        app.post('/user',async (req,res)=>{
            const email =req.query.email;
            const profile=req.body;
            console.log(email,profile)
            const result = await profilesCollection.insertOne(profile);
            res.send(result)
        })
        // ratings
        app.post('/reviews',async (req,res)=>{
          
            const reviews=req.body;
            console.log(reviews)
            const result = await reviewsCollection.insertOne(reviews);
            res.send(result)
        })
        // user information update
        app.put('/user',async(req,res)=>{
            const email=req.query.email;
            const address=req.body.address;
            const phone=req.body.phone;
            console.log
            const filter ={email:email};
            const options={upsert:true};
            const updateDoc={
                $set: {
                    address:address,
                    phone:phone
                  }
            }
            const result = await profilesCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        // Delte  a product of the user
        app.delete('/user/:_id',async(req,res)=>{
            const id=req.params._id;
            console.log(id);
            const filter={_id:ObjectId(id)};
            const result= await profilesCollection.deleteOne(filter);
            res.json(result);
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