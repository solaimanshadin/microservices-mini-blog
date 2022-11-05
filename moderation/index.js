const express = require('express')
const axios = require('axios')

const app = express();

app.use(express.json())
const handleEvent = async(type, data) => {
    if(type == 'CommentCreated') {
        const status = data.content.includes('fuck') ? 'rejected' : 'approved'
        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {...data, status}
        })
    }
}
app.post('/events', async (req, res) => {
    const { type , data } = req.body;
    handleEvent(type , data)
   
    res.send();
})

app.listen(4003, async() => {
    console.log("Listing on port :4003") 
    const res = await axios.get('http://localhost:4005/events')
    for(let event of res.data) {
        console.log("Processing events", event.type);
        handleEvent(event.type, event.data)
    }
})