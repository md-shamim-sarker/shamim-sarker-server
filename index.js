const express = require('express');
const cors = require('cors');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Local Database
// const uri = 'mongodb://localhost:27017';
// const client = new MongoClient(uri);

// Mongodb Atlas
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.egsefuu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});

async function run() {
  try {

    const categoriesCollection = client.db('shamimSarker').collection("categories");
    const notesCollection = client.db('shamimSarker').collection("notes");
    const usersCollection = client.db('shamimSarker').collection("users");

    // Post a user
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Get all users
    app.get('/users', async (req, res) => {
      const query = {};
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    // Get user by email
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = {email: email};
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // Post a category
    app.post('/categories', async (req, res) => {
      const category = req.body;
      const result = await categoriesCollection.insertOne(category);
      res.send(result);
      console.log('Category is added successfully!');
    });

    // Get all categories
    app.get('/categories', async (req, res) => {
      const query = {};
      const result = await categoriesCollection.find(query).toArray();
      res.send(result);
    });

    // Get categories by category
    app.get('/categories/:category', async (req, res) => {
      const category = req.params.category;
      const query = {category: category};
      const result = await categoriesCollection.findOne(query);
      res.send(result);
    });

    // Post a note
    app.post('/notes', async (req, res) => {
      const note = req.body;
      const result = await notesCollection.insertOne(note);
      res.send(result);
    });

    // Get notes by category
    app.get('/notes/:category', async (req, res) => {
      const category = req.params.category;
      const query = {category: category};
      const result = await notesCollection.find(query).toArray();
      res.send(result);
    });

    // Get notes by id
    app.get('/notes/id/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await notesCollection.findOne(query);
      res.send(result);
    });



    /*
        // R from CRUD
        app.get('/users', async (req, res) => {
          const query = {};
          const cursor = collection.find(query);
          const users = await cursor.toArray();
          res.send(users);
        });

        // R from CRUD (find by id)
        app.get('/users/:id', async (req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const user = await collection.findOne(query);
          res.send(user);
        });

        // R from CRUD (using query parameters)
        // http://localhost:5000/usrs?firstName=Shamim (query parameter format)
        app.get('/usrs', async (req, res) => {
          let query = {};
          if(req.query.firstName) {
            query = {
              firstName: req.query.firstName
            };
          }
          const cursor = collection.find(query);
          const usrs = await cursor.toArray();
          res.send(usrs);
        });

        // U from CRUD
        app.put('/users/:id', async (req, res) => {
          const id = req.params.id;
          const filter = {_id: ObjectId(id)};
          const user = req.body;
          const option = {upsert: true};
          const updatedUser = {
            $set: {
              firstName: user.firstName,
              lastName: user.lastName
            }
          };
          const result = await collection.updateOne(filter, updatedUser, option);
          res.send(result);
        });

        // D from CRUD
        app.delete('/users/:id', async (req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await collection.deleteOne(query);
          res.send(result);
        }); */

  } catch(error) {
    console.log(error.message);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is working fine!!!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});