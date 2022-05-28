const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

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
        


        app.post('/product/add', async (req, res) => {
             const data = req.body;
             const result = await products.insertOne(data);
    
             res.send(result);
          })


    } finally {
        await client.close();
    }
}


run().catch(console.dir);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})