const express = require("express");
const app = express();
require("dotenv").config();

const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  console.log(authorization);
  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "unauthorized access" });
  }
  // token from bearer
  const token = authorization.split(" ")[1];
  console.log("token inside verifyJWT", token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res
        .status(403)
        .send({ error: true, message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const usersCollection = client.db("emaJohn").collection("users");
    const productCollection = client.db("emaJohn").collection("products");
    const OrderCollection = client.db("emaJohn").collection("orders");
    const reviewCollection = client.db("emaJohn").collection("reviews");

    //adding jwt
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send(token);
    });

    // using verifyAdmin after verifyJWT
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      if (user?.role !== "Admin") {
        return res
          .status(403)
          .send({ error: true, message: "forbidden access" });
      }
      next();
    };

    // users related apis
    //users getting
    app.get("/users", verifyJWT, verifyAdmin, async (req, res) => {
      const query = {};
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });
    //user adding
    app.post("/users", async (req, res) => {
      const user = req.body;

      // console.log(user);
      const query = { email: user.email };
      //checking if user already existing, if not, only then add to db
      const existingUser = await usersCollection.findOne(query);
      // console.log("existing user: ", existingUser);
      if (existingUser) {
        return res.send({ message: "user already exists" });
      }
      const result = await usersCollection.insertOne(req.body);
      res.send(result);
    });

    //user deleting
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      // console.log("Delete result:", result);
      res.send(result);
    });

    // verifying if user is admin, verifuJWT, and if email is same
    app.get("/users/admin/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;

      if (req.decoded.email !== email) {
        res.send({ admin: false });
      }
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const result = { admin: user?.role === "Admin" };
      res.send(result);
    });

    // Making an user to Admin
    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: "Admin",
        },
      };
      const result = await usersCollection.updateOne(query, updateDoc);
      res.send(result);
    });

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
      // console.log(result);
      res.send(result);
    });

    // product adding to database
    app.post("/products", verifyJWT, verifyAdmin, async (req, res) => {
      const productItem = req.body;
      const result = await productCollection.insertOne(productItem);
      res.send(result);
    });

    // delete product
    app.delete("/products/:id", verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      // console.log("Delete result:", result);
      res.send(result);
    });

    //order collection get
    app.get("/orders", verifyJWT, async (req, res) => {
      const email = req.query.email;
      // console.log("Email:", email);
      if (!email) {
        return res.send([]);
        // return;
      }
      const decodedEmail = req.decoded.email;
      if (email !== decodedEmail) {
        return res
          .status(403)
          .send({ error: true, message: "forbidden access" });
      }
      const query = { email: email };
      const result = await OrderCollection.find(query).toArray();
      res.send(result);
    });

    //order collection post
    app.post("/orders", async (req, res) => {
      const order = req.body;
      // console.log(order);
      const result = await OrderCollection.insertOne(order);
      res.send(result);
    });
    //get order by id
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      // console.log(result)
      res.send(result);
    });
    //order delete
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await OrderCollection.deleteOne(query);
      // console.log("Delete result:", result);
      res.send(result);
    });

    // admin dashboard related operation
    app.get("/admin-stats", verifyJWT, verifyAdmin, async (req, res) => {
      const users = await usersCollection.estimatedDocumentCount();
      const products = await productCollection.estimatedDocumentCount();
      const orders = await OrderCollection.estimatedDocumentCount();

      const ordersCount = await OrderCollection.find().toArray();

      const totalPrice = ordersCount.reduce(
        (sum, order) => sum + order.price,
        0
      );

      console.log("Total Revenue:", totalPrice);

      res.send({ users, products, orders, totalPrice });
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
