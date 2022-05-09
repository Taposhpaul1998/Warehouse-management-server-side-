const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();


// middleware
app.use(cors());
app.use(express.json());

function veriguJWt(req, res, next) {
    const authHedar = req.headers.authorization;
    if (!authHedar) {
        return res.status(401).send({ message: 'unauthorizd access' })
    }
    const token = authHedar.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decode = decode;
    })

    next();
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c9swh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('Cyclehouse').collection('products');
        const pricingCollection = client.db('Cyclehouse').collection('pricing');
        const categoryCollection = client.db('Cyclehouse').collection('category');

        //auth
        app.post('/singin', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        })

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
            res.send(pricing);
        });

        // server api 
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get('/products/:id', veriguJWt, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const products = await productsCollection.findOne(query);
            res.send(products);
        });

        //POST 
        app.post('/products', async (req, res) => {
            const newProducts = req.body;
            const result = await productsCollection.insertOne(newProducts);
            res.send(result)
        })

        // // auth 
        // app.get('/products', async (req, res) => {
        //    
        //     const email = req;
        //     console.log(email);
        //     const query = {};
        //     const cursor = productsCollection.find(query);
        //     const myItem = await cursor.toArray();
        //     res.send(myItem);
        // })


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
