const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express();
app.use(express.json())
app.use(cors())
const posts = {}
const handleEvent = (type, data) => {
    if(type === 'PostCreated') {
        const {id, title} = data;
        posts[id] = { id, title, comments: [] }
    }
    if(type === 'CommentCreated') {
        const {commentId, content, postId, status} = data;
        const post = posts[postId];
        post?.comments?.push({commentId, content, status})
    }

    if(type === 'CommentUpdated') {
        const {commentId, content, postId, status} = data;
        let post = posts[postId];
        const comments = post?.comments?.map(cm => {
            if(cm.commentId == commentId) {
                return {commentId, content, status}
            }
            return cm;
        })
        posts[postId].comments = comments;
    }
}
app.post('/events', (req, res) => {
    const { type, data} = req.body;
    handleEvent(type, data)
    res.send({})
})

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.listen(4002, async() => {
    console.log("Listening for port : 4002")
    const res = await axios.get('http://localhost:4005/events')
    for(let event of res.data) {
        console.log("Processing events", event.type);
        handleEvent(event.type, event.data)
    }
})