const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const port = process.env.PORT || 5055
console.log(process.env.DB_USER)

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sot4y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error: ',err)
  const productsCollection = client.db("FoodDesire").collection("products");
  
  app.get('/products',(req,res) => {
    productsCollection.find()
    .toArray((err,items) => {
        res.send(items)
        console.log('From DataBase', items)
    })
  })

  app.post('/addProduct',(req,res) => {
      const newEvent = req.body;
      console.log('Adding New Event', newEvent)
      productsCollection.insertOne(newEvent)
      .then(result => {
          console.log('inserted count: ',result.insertedCount)
          res.send(result.insertedCount > 0)
      })
  })
  // perform actions on the collection object
  // console.log('Database connection successfully');
  // client.close();
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})