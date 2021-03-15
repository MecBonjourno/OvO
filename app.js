const express = require('express')
const app = express()
const mongoose = require('mongoose')

require('dotenv').config();
require('./models/user.model')

const PORT = 5000
const uri = process.env.MONGO_URI;

app.use(express.json())
app.use(require('./routes/auth'))

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo HOORAY🙌 ")
})

mongoose.connection.on('error', (err) => {
    console.log("connected to mongo", err)
})

app.listen(PORT, ()=> {
    console.log("Server is up and running", PORT)
})