const express = require('express')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p3yfj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        
        app.get('/', (req, res) => {
            res.send('Hello World!')
          })

    } finally {
        await client.close();
    }
}


run().catch(console.dir);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})