const express = require("express")
const socketio = require("socket.io")
const http = require("http")
const redis = require('redis')

const SERVER_NAME = process.env.SERVER_NAME

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

subscriber.on('subscribe', (channel, count)=>{
    console.log(`${SERVER_NAME} is subscribed to ${channel} successfully`)
})


//setup listener
subscriber.subscribe('bchat-chats')
subscriber2.subscribe('bchat-rooms')


const ServeChat = require('./routes/serveChats')
// const { count } = require("console")

app.use(express.json())
app.use('/chat', ServeChat)


app.get('/', (req, res)=> {
    res.send(`<h1>BChat Backend ${SERVER_NAME}</h1>`)
})


//creating map of individual clients with socket id for unicast
var connections = {}

//listener
io.on('connection', socket =>{

    socket.emit('log', `app is connected at ${SERVER_NAME}`)
    
    socket.on('message', msg =>{
        
        // console.log(msg)
        
        publisher.publish('bchat-chats', msg)
        const data = JSON.parse(msg)
        // if(data.broadcast){
            //     //handling broadcast
            //     io.emit('message', msg)
            // }else
            if(data.unicast){
                //handling unicast
                socket.emit('message', msg)
                
                // if(data.toUser in connections){
                    //     io.to(connections[data.toUser]).emit('message', msg)
                    //     socket.emit('message', msg)
                    // }
                }
                // else{
                    //     //handling multicast
                    //     io.to(data.room).emit('message', msg)
                    // }
                })
                
                socket.on("join", msg =>{
                    const data = JSON.parse(msg)
                    connections[data.user] = socket.id
                    socket.join(data.room)

                    //cache new room
                    publisher.get(data.room, (err, reply)=>{
                        if(!reply){
                            publisher.set(data.room, '1')
                            publisher.lpush(['roomP', data.room],(err, r) =>{})
                            //dummy publish to make aware the other servers that a new rooms has created
                            publisher.publish('bchat-rooms', "1")
                        }
                    })


                    socket.emit('log', `app is connected at ${SERVER_NAME}`)
                })
                
})



subscriber.on('message', (channel, msg) =>{
    try {
    
        console.log("Redis: ", msg)
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
    publisher.lrange('roomP',0,-1, (err, reply)=>{
        console.log(reply)
    })
})

const PORT = process.env.PORT || 8080
httpServer.listen(PORT, ()=> console.log(`Server Running @ ${PORT}`))