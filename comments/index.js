const express  = require('express')
const cors  = require('cors')
const axios = require('axios')
const { randomBytes} = require('crypto')
const app = express();

app.use(express.json())
app.use(cors())
const commentsByPostId = {

}

app.get('/posts/:id/comments' , (req, res) => {
    const {id} = req.params;
    res.send(commentsByPostId[id]);
})
app.post('/posts/:id/comments' , async(req, res) => {
    const {id} = req.params;
    const {content} = req.body;
    const comments = commentsByPostId[id] || [];
    const commentId = randomBytes(4).toString('hex');

    comments.push({
        content,
        id: commentId,
        status: 'pending'
    });
    commentsByPostId[id] = comments;
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            content,
            commentId: commentId,
            postId: id,
            status: 'pending'
        }
    })
    res.status(201).send(commentsByPostId);

}) 
const handleEvent = (type, data) => {
    if(type == 'CommentModerated') {
        const {commentId, postId, status, content} = data;
        let comments = commentsByPostId[postId];
        const comment = comments?.find((cm) => cm.id == commentId)
        comment && (comment.status = status);
        axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {commentId, postId, status, content}
        })
    }
}
app.post('/events', (req, res) => {
    console.log("Event received", req.body.type)
    const {type , data} = req.body;
    handleEvent(type , data)
})
app.listen(4001, async() => {
    console.log("Listing for port 4001")

    const res = await axios.get('http://localhost:4005/events')
    for(let event of res.data) {
        console.log("Processing events", event.type);
        handleEvent(event.type, event.data)
    }
});
