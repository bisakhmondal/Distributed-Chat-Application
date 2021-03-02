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

io.on('connection', socket =>{

    socket.on('message', msg =>{

        console.log(msg)
        const data = JSON.parse(msg)
        
        if(data.broadcast){
            io.emit('message', msg)
        }else{
            io.to(data.room).emit('message', msg)
        }
    })

    socket.on("join", msg =>{
        const data = JSON.parse(msg)

        socket.join(data.room)
    })

})


const PORT = process.env.PORT || 8080
httpServer.listen(PORT, ()=> console.log(`Server Running @ ${PORT}`))