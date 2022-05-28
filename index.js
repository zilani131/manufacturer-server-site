const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const express = require('express');
const cors=require('cors');

require('dotenv').config();
// const stripe = require('stripe')('sk_test_51L3OyhAvteCnNItpNsrkDuJrjbM0TF2qvjUYqbswJczodeXA9sqCt2rIME89vyEUKSmyePybFOyOWxYRRdjYHwsy004g9Tta8T');
const app = express();
const port = process.env.PORT||5000;
app.use(cors());
app.use(express.json());
// user : manufacture_zilani
// pw: Hub1HeEUkgGJiGqy


const uri = `mongodb+srv://${process.env.userinfo}:${process.env.pw}@cluster0.z3wp7.mongodb.net/?retryWrites=true&w=majority`;
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
        // tools added api
        app.post('/tools',async(req,res)=>{
            const tools=req.body;
            console.log(tools)
            const result= await toolsCollection.insertOne(tools)
            res.send(result);
        })
        // payment intent
        // app.post("/create-payment-intent", async (req, res) => {
        //     const service = req.body;
        //     console.log(service)
        //     // const price=service.totalAmount;
        //     // const amount=price*100;

          
        //     // // Create a PaymentIntent with the order amount and currency
        //     // const paymentIntent = await stripe.paymentIntents.create({
        //     //   amount: amount,
        //     //   currency: "usd",
        //     //   payment_method_types: ['card'],
        //     // });
            
        //     res.json({
        //       clientSecret: paymentIntent.client_secret,
        //     });
        //   });
        // purchase tool api
        app.get('/purchase/:_id',async (req,res)=>{
            const _id=req.params._id;
         
            const query={_id:ObjectId(_id)}
            const tool=await toolsCollection.findOne(query)
            res.send(tool)
        })
        // geting payment information 
        app.get('/payment/:_id',async(req,res)=>{
            const _id=req.params._id;
            const query={_id:ObjectId(_id)}
            const payment=await profilesCollection.findOne(query)
            res.send(payment)
        })
    // user details 
    app.get('/userdetails/:email',async(req,res)=>{
        const email=req.params.email;
        const query={email:email};
        const result =await detailsCollection.findOne(query);
        res.json(result);
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
        // shipping an order 
        app.put('/order/:_id',async(req,res)=>{
            const _id=req.params._id;
            const newStatus=req.body.status;
            const filter={_id:ObjectId(_id)};
            const options={upsert:true};
            const updateDoc={
                $set:{
                    status:newStatus,
                },
            }
            const result =await profilesCollection.updateOne(filter,updateDoc,options)
            res.send(result)
        })
            // update quantity
            app.put('/cancel/:_id',async(req,res)=>{
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
        // geting user order list by email
        app.get('/user',async(req,res)=>{
            const email=req.query.email;
            const query={email:email};
            const result = await profilesCollection.find(query).toArray();
            res.send(result);
        })
        // getting all user order list for admin
        app.get('/orderlist',async(req,res)=>{
            const result = await profilesCollection.find().toArray();
            res.send(result); 
        })
        // getting all user 
        app.get('/alluser',async(req,res)=>{
            const result=await detailsCollection.find().toArray();
            res.send(result)
        })
        // make admin
        app.put('/alluser',async(req,res)=>{
            const role=req.body.role;
        
            const email=req.query.email;
            console.log(role,email);
       
            const filter ={email:email};
            const options={upsert:true};
            const updateDoc={
                $set: {
                   role:role,
                  }
            }
            const result = await detailsCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        // user reviews getting 
        app.get('/reviews',async(req,res)=>{
            const query={};
            const result=await reviewsCollection.find(query).toArray();
            res.send(result)
        })
        // save details
        // app.post('/userdetails',async(req,res)=>{
            
        //     const profile=req.body;
        //     console.log(profile)
        //     const result = await detailsCollection.insertOne(profile);
        //     res.send(result)
        // })
        // save user details
        app.put('/userdetails/:email',async(req,res)=>{
            const email=req.params.email;
            const user=req.body;
            const filter={email:email};
            const options={upsert:true};
            const updateDoc={
                $set:user,
            };
            const result=await detailsCollection.updateOne(filter,updateDoc,options)
            res.send(result);
        })
        app.put('/updatedetails/:email',async(req,res)=>{
            const email=req.params.email;
            const linkedin=req.body.linkedin;
            const phone=req.body.phone;
            const education =req.body.education;
            const filter={email:email};
            const options={upsert:true};
            const updateDoc={
                $set: {
                    education:education,
                    phone:phone,
                    linkedin:linkedin,
                  }
            }
            const result=await detailsCollection.updateOne(filter,updateDoc,options)
               res.send(result);
        })
        // getting user details
        
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
        // product Delete
        app.delete('/product/:_id',async(req,res)=>{
            const result =await toolsCollection.deleteOne({_id:ObjectId(req.params._id)})  //shortand the code 
            res.send(result)
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