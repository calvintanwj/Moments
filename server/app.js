const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
const { mongoURI } = require('./key')
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
	console.log('connected to db')
})

app.use(express.json())

app.get('/', (req, res) => {
	res.send('This is the homepage')
})

app.post('/', (req, res) => {
	console.log(req.body)
	res.status(200).send('Got it')
})

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`)
})