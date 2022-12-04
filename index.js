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
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Mongodb Atlas
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.egsefuu.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});

async function run() {
  try {

    const categoriesCollection = client.db('shamimSarker').collection("categories");
    const interviewCategoriesCollection = client.db('shamimSarker').collection("interviewCategories");
    const notesCollection = client.db('shamimSarker').collection("notes");
    const interviewQuestionsCollection = client.db('shamimSarker').collection("interviewQuestions");
    const usersCollection = client.db('shamimSarker').collection("users");

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
      const option = {upsert: false};
      const updatedUser = {$set: {isRemoved: true}};
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

    app.get('/usrs', async (req, res) => {
      const query = {
        role: req.query.role || 'reader',
        isVerified: Boolean(req.query.verified) || false,
        isSuperAdmin: Boolean(req.query.superAdmin) || false
      };
      console.log(query);
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });


    /*******************************
    * Interview Category Related API
    ********************************/
    // Post a interview category
    app.post('/interviewCategories', async (req, res) => {
      const interviewCategory = req.body;
      const result = await interviewCategoriesCollection.insertOne(interviewCategory);
      res.send(result);
      console.log('Interviews Category is added successfully!');
    });

    // Get all interview categories
    app.get('/interviewCategories', async (req, res) => {
      const query = {};
      const result = await interviewCategoriesCollection.find(query).toArray();
      res.send(result);
    });

    // Get interview categories by category
    app.get('/interviewCategories/:interviewCategory', async (req, res) => {
      const interviewCategory = req.params.interviewCategory;
      const query = {category: interviewCategory};
      const result = await interviewCategoriesCollection.findOne(query);
      res.send(result);
    });

    /*******************************
    * Interview Question Related API
    ********************************/
    // Post a interview question note
    app.post('/questions', async (req, res) => {
      const question = req.body;
      const result = await interviewQuestionsCollection.insertOne(question);
      res.send(result);
    });

    // Get notes by category
    app.get('/questions/:category', async (req, res) => {
      const category = req.params.category;
      const query = {category: category};
      const result = await interviewQuestionsCollection.find(query).toArray();
      res.send(result);
    });

    // Get interview notes by id
    app.get('/questions/id/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await interviewQuestionsCollection.findOne(query);
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

    /****************
    * Note Related API
    *****************/
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