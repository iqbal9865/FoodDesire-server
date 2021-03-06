const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID;
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
  const ordersCollection = client.db("FoodDesire").collection("orders");
  
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
  app.delete('/delete/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    console.log('delete this',id)
    productsCollection.findOneAndDelete({_id: id})
    .then(documents => res.send(!!documents.value))
  })

 

  app.post('/addOrder',(req,res) => {
    const order = req.body;
    console.log('Adding New order', order)
    ordersCollection.insertOne(order)
    .then(result => {
        console.log('inserted count: ',result.insertedCount)
        res.send(result.insertedCount > 0)
    })
})

app.get('/orders',(req,res) => {
  console.log(req.query.email)
  ordersCollection.find({email: req.query.email})
  .toArray((err,ord) => {
      res.send(ord)
      console.log('From DataBase', ord)
  })
})

});




app.listen(process.env.PORT || port)