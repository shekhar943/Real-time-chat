const express = require('express')
const dotenv = require('dotenv')
const app = express()

const PORT = process.env.PORT || 3000
app.use(express.static('public'))

dotenv.config({path: './config.env'})
require('./db')

const Comment = require('./models/comment')

app.use(express.json())


//routes
app.post('/api/comments', (req, res) => {
    const comment = new Comment({
        username: req.body.username,
        comment: req.body.comment
    })
    comment.save().then(response => {
        res.send(response)
    })
})


app.get('/api/comments', (req, res) => {
    Comment.find().then(comments => {
        res.send(comments)
    })
})


const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})



let io = require('socket.io')(server)
io.on('connection', (socket) => {
    // console.log(`New connection: ${socket.io}`)

    //recive event
    socket.on('comment', (data) => {
        // console.log(data)
        data.time = Date()
        socket.broadcast.emit('comment', data)
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    })
})