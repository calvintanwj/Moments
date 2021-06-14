const express = require('express')
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	res.send('This is the homepage')
})
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`)
})