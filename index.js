const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c9swh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('Cyclehouse').collection('products');
        const pricingCollection = client.db('Cyclehouse').collection('pricing');
        const categoryCollection = client.db('Cyclehouse').collection('category');

        // category 
        app.get('/category', async (req, res) => {
            const query = {};
            const cursor = categoryCollection.find(query);
            const category = await cursor.toArray();
            res.send(category);
        });

        // pricing 
        app.get('/pricing', async (req, res) => {
            const query = {};
            const cursor = pricingCollection.find(query);
            const pricing = await cursor.toArray();
            res.send(products);
        });

        // server api 
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const products = await productsCollection.findOne(query);
            res.send(products);
        });

        // post collection api
        app.get('/products', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        //POST 
        app.post('/products', async (req, res) => {
            const newProducts = req.body;
            const result = await productsCollection.insertOne(newProducts);
            res.send(result)
        })
        // delete

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
};
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Ranning Cycle House server');
});

app.listen(port, () => {
    console.log('listen port', port);
});
