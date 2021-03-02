import React from "react"
import Home from "./components/home"
// import Chat from "./components/chat"
import DashBoard from "./screens/dashboard"
// var ws = new WebSocket("ws://localhost:8080")
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:8080"
var socket = socketIOClient(ENDPOINT)

const App = () => {
  // <Home />
  
  
  // ws.onopen = () =>{
    //   console.log("socket openned")
    //   ws.send(JSON.stringify({"user":"Bisakh", "room":"Hawas"}))
    // }
    
    const [input, setInput] = React.useState("")
    const [room, setRoom] = React.useState("")
    const [user, setUser] = React.useState("")
    const [elt, setelt] = React.useState([])
    const [selt, setselt] = React.useState(null)
    React.useEffect(()=>{
      socket.on("message",  msg =>{
        const data = JSON.parse(msg)
        console.log(elt)
        setselt(data)
      })

      return ()=>{
        socket.off('message')
      }
    },[])


    React.useEffect(() => {
      setelt([...elt, selt])
    },[selt])
    
    const [connected, setConnected] = React.useState(false)
    const [isBroadCast, setIsBroadCast] = React.useState(false);
  
  
    const send = () =>{
    const data = {
      time: new Date(),
      user: user,
      room: room,
      data: input,
      broadcast: Number(isBroadCast)
    }
    socket.emit('message', JSON.stringify(data))
    setInput("")    
  }
  const Connect = () => {
    setConnected(true)
    socket.emit('join',JSON.stringify({
      room:room
    }))

    setelt([])
  }

  return (

    // <DashBoard /> 
    <div>
      <div className="App">
      <h1 className="p-3"><strong><span style={{color:"blue"}}>B</span>Chat</strong> A Multi Room Chat Application</h1> 
      </div>
      <h1> Room Info </h1>
      {!connected ?
      <div>
    <input value={user} onChange={e=> setUser(e.target.value)} placeholder="@Username" />
    <input value={room} onChange={e=> setRoom(e.target.value)} placeholder="#Room" />
    <button onClick={Connect}> Connect</button>
    </div>
        :
        
        <div>
          <h3>Username: {user}</h3>
          <h3>Room: {room}</h3>
          <button onClick={()=> setConnected(false)}> Edit</button>
          </div>
      }
    <h1>Messages: </h1>
     
      <ul>
        {elt.filter(e=> e !==null).map(data => <li key={data.time}>{new Date(data.time).toLocaleString()} ::: {data.broadcast?`!!Global Broadcast!!`:``} {data.user}: {data.data}</li>)}
      </ul>
      <hr />

      <div style={{position:"fixed", bottom:0}}>
    <label>Enter Message &nbsp;</label> 
    <input value={input} onChange={e=> setInput(e.target.value)} placeholder="Enter Your Message" />
    <br />
    <br />

    <div>
      <h4 style={{fontFamily:"OpenSans"}}>Optional Filters</h4>
      <label >Broadcast? &nbsp;</label>
    <input
        type="checkbox"
        onChange={(event) => setIsBroadCast(event.currentTarget.checked)}
        checked={isBroadCast}
      /> 
    
    <br />

    <label>Personal One to One DM &nbsp;</label>
    <input value={input} onChange={e=> setInput(e.target.value)} placeholder="@ Direct Messaging" />

    </div>
    <br />
    <button onClick={send}> Send</button>
    <hr />
    </div>
    </div>
  );
}

export default App;
