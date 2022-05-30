const express = require('express')
var cors = require('cors')
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p3yfj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const pcPartsDB = client.db("pcPartsDB");
        const products = pcPartsDB.collection("products");
        const users = pcPartsDB.collection("users");
        const orders = pcPartsDB.collection("orders");
        const reviews = pcPartsDB.collection("reviews");


        app.post('/create-payment-intend',async(req,res)=>{
            const {price} = req.body;
            const amount = price*100;
            const paymentIntent = await stripe.paymentIntents.create({
                amount : amount,
                currency : 'usd',
                payment_method_types:['card']
            });
            res.send({clientSecret:paymentIntent.client.secret});
        });


        app.get('/product', async (req, res) => {
            const query = req.query;
            const cursor = await products.find(query).limit(3);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/product/all', async (req, res) => {
            const query = req.query;
            const cursor = await products.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/product/purchase/:id', async (req, res) => {
            let id = req.params.id;
         
           
            const cursor = await products.find({ _id: ObjectId(id) });
            const result = await cursor.toArray();
            res.send(result[0]);
        });




        app.post('/product/add', async (req, res) => {
            const data = req.body;
            const result = await products.insertOne(data);
            res.send(result);
        });

        app.delete('/product/delete/:id', async (req, res) => {
            const id = req.params.id;

            const filter = { _id: ObjectId(id) };

            const result = await products.deleteOne(filter);

            res.send(result);
        });




        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;

            const filter = { email };

            const options = { upsert: true };


            const updateDoc = { $set: req.body }


            const result = await users.updateOne(filter, updateDoc, options);

            res.send(result);
        });

        app.get('/user/:email', async (req, res) => {
            let email = req.params.email;

            const cursor = await users.find({ email });


            const result = await cursor.toArray();

            res.send(result[0]);
        });

        app.get('/user', async (req, res) => {
            const query = req.query;
            const cursor = await users.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });




        app.post('/order/add', async (req, res) => {
            const data = req.body;
            const result = await orders.insertOne(data);
            res.send(result);
        });


        app.get('/order/:email', async (req, res) => {
            let email = req.params.email;

            const cursor = await orders.find({ email });


            const result = await cursor.toArray();

            res.send(result);
        });

        
        app.get('/order/purchase/:id', async (req, res) => {
            let id = req.params.id;
         
            const cursor = await orders.find({ _id: ObjectId(id) });
            const result = await cursor.toArray();
            res.send(result[0]);
        });



        app.delete('/order/delete/:id', async (req, res) => {
            const id = req.params.id;

            const filter = { _id: ObjectId(id) };

            const result = await orders.deleteOne(filter);

            res.send(result);
        });


        app.post('/review/add', async (req, res) => {
            const data = req.body;
            const result = await reviews.insertOne(data);
            res.send(result);
        });


        app.get('/review', async (req, res) => {
            const query = req.query;
            const cursor = await reviews.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });





        app.get('/', (req, res) => {
            res.send('Hello World!')
        })


    } finally {
        // await client.close();
    }
}


run().catch(console.dir);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})