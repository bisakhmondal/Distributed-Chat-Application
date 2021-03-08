const express = require("express")
const socketio = require("socket.io")
const http = require("http")


// s1 s2 s3 s4
const redis = require('redis')
const cors = require('cors')

const SERVER_NAME = process.env.SERVER_NAME || "APP"

const app = express()
const httpServer = http.createServer(app)
const io = socketio(httpServer, {
    cors: {
      origin: '*',
    }
  })

const redisConfig = {
    port: 6379,
    host: process.env.REDIS_HOST || "turing"
}

const publisher = redis.createClient(redisConfig)
const subscriber = redis.createClient(redisConfig)
const subscriber2 = redis.createClient(redisConfig)
const subscriber3 = redis.createClient(redisConfig)

subscriber.on('subscribe', (channel, count)=>{
    console.log(`${SERVER_NAME} is subscribed to ${channel} successfully`)
})


//setup listener
subscriber.subscribe('bchat-chats')
subscriber2.subscribe('bchat-rooms')
subscriber3.subscribe('bchat-users')


const ServeChat = require('./routes/serveChats')
// const { count } = require("console")

app.use(express.json())
app.use(cors())
app.use('/chat', ServeChat)


app.get('/', (req, res)=> {
    res.send(`<h1>BChat Backend ${SERVER_NAME}</h1>`)
})

const mongoose = require('mongoose')
const ChatSchema = require('./models/chat')

mongoose.connect(process.env.MONGO || "mongodb://localhost:27017/BChat",
    { useNewUrlParser: true,useUnifiedTopology: true },async (err)=>{
        if(err) console.log(err.message);
        else    console.log('DB connection successful');
});

//creating map of individual clients with socket id for unicast
var connections = {}

//listener
io.on('connection', socket =>{

    socket.emit('log', `app is connected at ${SERVER_NAME}`)

    //send initial room info 
    publisher.lrange('roomBCHAT',0,-1, (err, reply)=>{
        socket.emit('room', JSON.stringify(reply))
    })
    
    socket.on('message', async msg =>{
        
        publisher.publish('bchat-chats', msg)
        const data = JSON.parse(msg)

        const Chat = new ChatSchema(data)
        await Chat.save()   

        if(data.unicast){
            //handling unicast
            socket.emit('message', msg)
            }
        }
    )
        
    socket.on("join", msg =>{
        const data = JSON.parse(msg)
        connections[data.user] = socket.id
        socket.join(data.room)

        //cache new room
        publisher.get(data.room, (err, reply)=>{
            if(!reply){
                publisher.set(data.room, '1')
                publisher.lpush(['roomBCHAT', data.room],(err, r) =>{})
                //dummy publish to make aware the other servers that a new rooms has created
                publisher.publish('bchat-rooms', "1")
            }
        })
            publisher.lpush([`${data.room}_meta`, data.user],(err, r) =>{})

            publisher.publish('bchat-users', data.room)

        socket.emit('log', `app is connected at ${SERVER_NAME}`)
    })
                
})



subscriber.on('message', (channel, msg) =>{
    try {
    
        //console.log("Redis: ", msg)
        const data = JSON.parse(msg)
        
        if(data.broadcast){
            //handling broadcast
            io.emit('message', msg)
        }else if(data.unicast){
        //handling unicast
            if(data.toUser in connections){
                io.to(connections[data.toUser]).emit('message', msg)
                // socket.emit('message', msg)
            }
        }
        else{
            //handling multicast
            io.to(data.room).emit('message', msg)
        }
    } catch (error) {
        console.log(`${SERVER_NAME}: Error Occured, ${error}`)
    }
    
})

subscriber2.on('message', (c, m) =>{
    publisher.lrange('roomBCHAT',0,-1, (err, reply)=>{
        io.emit('room', JSON.stringify(reply))
    })
})

subscriber3.on('message', (c, m) =>{
    //send initial room info 
    // console.log(m," : c : ", c)

    publisher.lrange(`${m}_meta`,0,-1, (err, reply)=>{
        // console.log("sending", reply)
            io.to(m).emit('roomusers', JSON.stringify(reply))
    })
})

const PORT = process.env.PORT || 8080
httpServer.listen(PORT, ()=> console.log(`Server Running @ ${PORT}`))
