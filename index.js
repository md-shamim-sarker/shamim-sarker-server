const express = require('express');
const cors = require('cors');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if(!authHeader) {
    return res.status(401).send({message: 'Unauthorized Access'});
  }
  const token = authHeader;
  jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded) {
    if(err) {
      return res.status(401).send({message: 'Unauthorized Access'});
    }
    req.decoded = decoded;
    next();
  });
}

// Local Database
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Mongodb Atlas
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.egsefuu.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});

async function run() {
  try {

    const categoriesCollection = client.db('shamimSarker').collection("categories");
    const notesCollection = client.db('shamimSarker').collection("notes");
    const usersCollection = client.db('shamimSarker').collection("users");


    /* JWT API */
    app.post('/jwt', (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN);
      console.log(token);
      res.send({token});
    });

    /*****************
    User Related API
    *****************/
    // Post a user
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Get all users
    app.get('/users', async (req, res) => {
      const query = {
        isRemoved: false
      };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    // get users by query parameters
    /* app.get('/usrs', async (req, res) => {
      const query = {
        role: req.query.role || 'reader',
        isVerified: Boolean(req.query.verified) || false,
        isSuperAdmin: Boolean(req.query.superAdmin) || false
      };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    }); */

    // get all admins
    app.get('/users/admins', async (req, res) => {
      const query = {
        isAdmin: true,
        isRemoved: false
      };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    // get all writer
    app.get('/users/writers', async (req, res) => {
      const query = {
        isAdmin: false,
        role: 'writer',
        isRemoved: false
      };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    // get all reader
    app.get('/users/readers', async (req, res) => {
      const query = {
        isAdmin: false,
        role: 'reader',
        isRemoved: false
      };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    // Get all removed users
    app.get('/removed-users', async (req, res) => {
      const query = {
        isRemoved: true
      };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    // Update to verify
    app.put('/users/verify/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const option = {upsert: true};
      const updatedUser = {$set: {isVerified: true}};
      const result = await usersCollection.updateOne(filter, updatedUser, option);
      res.send(result);
    });

    // Update to unverify
    app.put('/users/unverify/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const option = {upsert: false};
      const updatedUser = {$set: {isVerified: false}};
      const result = await usersCollection.updateOne(filter, updatedUser, option);
      res.send(result);
    });

    // Update to make admin
    app.put('/users/make-admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const option = {upsert: false};
      const updatedUser = {$set: {isAdmin: true}};
      const result = await usersCollection.updateOne(filter, updatedUser, option);
      res.send(result);
    });

    // Update to remove admin
    app.put('/users/remove-admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const option = {upsert: false};
      const updatedUser = {$set: {isAdmin: false}};
      const result = await usersCollection.updateOne(filter, updatedUser, option);
      res.send(result);
    });

    // Update to remove user
    app.put('/users/remove-user/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const complainer = req.body;
      const option = {upsert: true};
      const updatedUser = {
        $set: {
          isRemoved: true,
          complainerName: complainer.complainerName,
          complainerEmail: complainer.complainerEmail,
        }
      };
      const result = await usersCollection.updateOne(filter, updatedUser, option);
      res.send(result);
    });

    // Update to restore user
    app.put('/users/restore-user/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const option = {upsert: false};
      const updatedUser = {$set: {isRemoved: false}};
      const result = await usersCollection.updateOne(filter, updatedUser, option);
      res.send(result);
    });

    // Get user by email
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = {email: email};
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    /********************
    * Category Related API
    *********************/
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

    // Get categories by category type
    app.get('/categories/categoryType/:categoryType', async (req, res) => {
      const categoryType = req.params.categoryType;
      const query = {categoryType: categoryType};
      const result = await categoriesCollection.find(query).toArray();
      res.send(result);
    });

    /****************
    * Note Related API
    *****************/
    // Post a note
    app.post('/notes', async (req, res) => {
      const note = req.body;
      const result = await notesCollection.insertOne(note);
      res.send(result);
    });

    // Get all notes
    app.get('/notes', async (req, res) => {
      const query = {};
      const result = await notesCollection.find(query).toArray();
      res.send(result);
    });

    // Get notes by category
    app.get('/notes/:category', async (req, res) => {
      const category = req.params.category;
      const query = {category: category};
      const result = await notesCollection.find(query).toArray();
      res.send(result);
    });

    // Get notes by category-type
    app.get('/notes/category-type/:categoryType', async (req, res) => {
      const categoryType = req.params.categoryType;
      const query = {categoryType: categoryType};
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

    // Get notes by email
    app.get('/notes/email/:email', verifyJWT, async (req, res) => {
      const decoded = req.decoded;
      const email = req.params.email;
      if(decoded.email !== email) {
        res.status(401).send({message: 'Unauthorized Access'});
      }
      const query = {userEmail: email};
      const result = await notesCollection.find(query).toArray();
      res.send(result);
    });
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