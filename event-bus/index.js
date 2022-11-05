const express = require('express')
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json())

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;
    events.push(event);
    axios.post('http://localhost:4000/events', event).then((result) => {
        
    }).catch((err) => {
        
    });
    axios.post('http://localhost:4001/events', event).then((result) => {
        
    }).catch((err) => {
        
    });
  
    axios.post('http://localhost:4002/events', event).then((result) => {
        
    }).catch((err) => {
        
    });
    

    axios.post('http://localhost:4003/events', event).then((result) => {
        
    }).catch((err) => {
        
    });
   
    res.send({status: 'ok'})
})

app.get('/events', (req, res) => {
    res.send(events)
})

app.listen(4005, () => {
    console.log("Listing for port 4005");
})