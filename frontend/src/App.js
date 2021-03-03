import React from "react"
import Home from "./components/home"
import DashBoard from "./screens/dashboard"
import Scroll from "./components/leftscroll"
import axios from "axios"
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:8080"
var socket = socketIOClient(ENDPOINT,{
  transports: [ "websocket" ] 
})

const App = () => {
      
    const [input, setInput] = React.useState("")
    const [room, setRoom] = React.useState("")
    const [user, setUser] = React.useState("")
    const [elt, setelt] = React.useState([])
    const [selt, setselt] = React.useState(null)
    const [roomlist, setRoomlist] = React.useState([])

    React.useEffect(()=>{
      socket.on("message",  msg =>{
        const data = JSON.parse(msg)
        console.log(elt)
        setselt(data)
      })

      socket.on('room', msg =>{
        const data = JSON.parse(msg)
        console.log(data)
        setRoomlist(data)
      })

      socket.on('log', msg=> console.log(msg))

      //fetch initial rooms
      // axios.get('http://localhost:8080/rooms').then(res =>{}).catch(err=>{})

      return ()=>{
        socket.off('message')
        socket.off('log')
        socket.off('room')
      }
    },[])


    React.useEffect(() => {
      setelt([...elt, selt])
    },[selt])
    
    const [connected, setConnected] = React.useState(false)
    const [img, setImg] = React.useState(null)
    const [isBroadCast, setIsBroadCast] = React.useState(false);
    const [toUser, setToUser] = React.useState('');
  
  
    const send = () =>{
      const isUnicast = !isBroadCast && (toUser!=='')
      if(!isBroadCast && room===""){
        alert("Only Broadcast & DM are allowed Without joining any room")
        return
      }
      if(room==="" && !isBroadCast && !isUnicast){
        alert("Either Join a chatroom or Broadcast or use Direct Messaging")
        return
      }
    
    if(img){

      //converting to base64
      let reader = new FileReader();
      reader.readAsDataURL(img)

      reader.onload = () =>{
        
        const data = {
          time: new Date(),
          user: user,
          room: room,
          data: reader.result,
          type: "image",
          broadcast: Number(isBroadCast),
          unicast: isUnicast,
          toUser: toUser
        }
        socket.emit('message', JSON.stringify(data))
        setImg(null)
      }
    }


    if(input!==""){
    
      const data = {
        time: new Date(),
        user: user,
        room: room,
        data: input,
        type: "text",
        broadcast: Number(isBroadCast),
        unicast: isUnicast,
        toUser: toUser
      }
      socket.emit('message', JSON.stringify(data))
      setInput("")
  }

  }
  const Connect = () => {
    setConnected(true)
    socket.emit('join',JSON.stringify({
      room:room,
      user:user, 
    }))

    setelt([])
  }

  return (

    // <DashBoard /> 
    <div style={{fontFamily:"OpenSans", padding:20}}>
      <div className="App">
      <h1 className="p-3"><strong><span style={{color:"blue"}}>B</span>Chat</strong> A Multi Room Chat Application</h1> 
      </div>
      <Scroll rooms={roomlist}/>
      <h1 style={{color:"#820000"}}> Room Info </h1>
      {!connected ?
      <div>
    <input value={user} onChange={e=> setUser(e.target.value)} placeholder="@Username" />
    <input value={room} onChange={e=> setRoom(e.target.value)} placeholder="#Room" />
    <button onClick={Connect}> Connect</button>
    </div>
        :
        
        <div>
          <h4>Username: {user}</h4>
          <h4>Room: {room}</h4>
          <button onClick={()=> setConnected(false)}> Edit</button>
          </div>
      }
    <h1 style={{color:"#820000"}}>Messages: </h1>
     
     <div  style={{fontSize:"medium"}}>

      <ul>
        {elt
        .filter(e=> e !==null)
        .map(data => {
        
        if(data.type==="text")
          return <li key={data.time}>{new Date(data.time).toLocaleString()} - <span style={{color:"red"}}>{data.broadcast?`!!Global Broadcast!!`:``}</span> {data.user} :- {data.data}</li>
        return <li key={data.time}>{new Date(data.time).toLocaleString()} - <span style={{color:"red"}}>{data.broadcast?`!!Global Broadcast!!`:``}</span> {data.user} :- <img src={data.data} height="256" width="300"/></li>

        }
        )}
        </ul>
      <hr />
      <hr />
     
     </div>

      <div >
    <label>Enter Message &nbsp;</label> 
    <input value={input} onChange={e=> setInput(e.target.value)} placeholder="Enter Your Message" />
      
    <input type="file" onChange={e=> setImg(e.target.files[0])} placeholder="Upload image" id="upload-photo" style={{display:"none"}}/>
    <label htmlFor="upload-photo">
    {
      img ? <div><span>{img.name} {Math.round(img.size/ (1024))} KB</span></div> : <div><h4 style={{fontFamily:"OpenSans"}}>Click to Upload Image</h4></div>
            }
    </label>
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
    <input value={toUser} onChange={e=> setToUser(e.target.value)} placeholder="@ Direct Messaging" />

    </div>
    <br />
    <button onClick={send}> Send</button>
    <hr />
    </div>
    </div>
  );
}

export default App;
