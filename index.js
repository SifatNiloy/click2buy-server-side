const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nlpzidc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection = client.db("emaJohn").collection("products");
    const OrderCollection = client.db("emaJohn").collection("orders");

    app.get("/limitedProduct", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.skip(10).limit(8).toArray();
      res.send(products);
    });

    //proudcts and product count for shop page and pagination
    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log(page, size)
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count, products });
    });

    //product search from database
    app.get("/products/:name", async (req, res) => {
      let regex = new RegExp(req.params.name, "i");
      let result = await productCollection.find({ name: regex }).toArray();
      console.log(result);
      res.send(result);
    });


    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("click2buy server connected");
});

app.listen(port, () => {
  console.log(`listening to port, ${port}`);
});
