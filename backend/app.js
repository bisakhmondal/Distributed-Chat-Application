const express = require("express")
const socketio = require("socket.io")
const http = require("http")


const app = express()
const httpServer = http.createServer(app)
const io = socketio(httpServer, {
    cors: {
      origin: '*',
    }
  })

app.get('/', (req, res)=> {
    res.send("<h1>BChat Backend</h1>")
})

var connections = {}
io.on('connection', socket =>{

    socket.on('message', msg =>{

        console.log(msg)
        const data = JSON.parse(msg)
        
        if(data.broadcast){
            //handling broadcast
            io.emit('message', msg)
        }else if(data.unicast){
           //handling unicast
            if(data.toUser in connections){
                io.to(connections[data.toUser]).emit('message', msg)
                socket.emit('message', msg)
            }
        }
        else{
            //handling multicast
            io.to(data.room).emit('message', msg)
        }
    })

    socket.on("join", msg =>{
        const data = JSON.parse(msg)
        connections[data.user] = socket.id
        socket.join(data.room)
    })

})


const PORT = process.env.PORT || 8080
httpServer.listen(PORT, ()=> console.log(`Server Running @ ${PORT}`))