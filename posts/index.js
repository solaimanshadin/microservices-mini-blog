const express = require("express");
const { randomBytes } = require("crypto");
const cors = require('cors')
const axios = require('axios')
const app = express();
app.use(cors())

app.use(express.json())
const posts = {

}

app.get("/posts", (req, res) => {
    res.status(201).send(posts)
})
app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    posts[id] = {
        title,
        id
    }
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            title,
            id
        }
    })
    res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {
    console.log("Event received", req.body.type)
})
app.listen(4000, async() => {
    console.log("Listing to port 4000");
})