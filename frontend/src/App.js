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
    const [userlist, setUserlist] = React.useState([])
    // const [suser, setSuser] = React.useState(null)


    
    
    React.useEffect(()=>{
      socket.on("message",  msg =>{
        const data = JSON.parse(msg)
        setselt(data)
      })
      
      socket.on('roomusers', msg =>{
        let data = JSON.parse(msg)
        const uniquedata = data.filter((elem, pos) => {
          return data.indexOf(elem) == pos;
      })
        setUserlist(uniquedata)
      })

      socket.on('room', msg =>{
        const data = JSON.parse(msg)
        // console.log(data)
        setRoomlist(data)
      })

      

      socket.on('log', msg=> console.log(msg))

      return ()=>{
        socket.off('message')
        socket.off('log')
        socket.off('room')
        socket.off('roomusers')
      }
    },[])


    React.useEffect(() => {
      setelt([...elt, selt])
    },[selt])
    
    const [connected, setConnected] = React.useState(false)
    const [img, setImg] = React.useState(null)
    const [isBroadCast, setIsBroadCast] = React.useState(false);
    const [toUser, setToUser] = React.useState('');
    const [dm ,setDm] = React.useState(false)
    const [gm, setGm] = React.useState(true)
    const send = () =>{
      const isUnicast = !isBroadCast && (toUser!=='')

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
      setToUser("")
  }

  }
  const Connect = () => {
    setConnected(true)
    socket.emit('join',JSON.stringify({
      room:room,
      user:user, 
    }))

    socket.emit('message', JSON.stringify({
      time: new Date(),
      user: '',
      room: room,
      data: `${user} has joined the Room!!`,
      type: "text",
      broadcast: 0,
      unicast: false,
      toUser: ''
    }))

    axios.post('http://localhost:8080/chat', {room:room, user:user}).then(res =>{
      console.log(res)
      if(res.status===200)
        setelt(res.data)
    })
  }

  const getDM = async () =>{
    if(user===""){
      alert("Be a user first")
      return
    }
    setDm(!dm)
    setGm(!gm)

    try{
    const res = await axios.post('http://localhost:8080/chat/dm', {room:room, user:user})
    // fetch('',)
    if(res.status===200)
    setelt(res.data)
    }catch(err){

    }

    
  }
  const getGM = async () =>{
    if(room===""){
      alert("Join a room first")
      return
    }
    setDm(!dm)
    setGm(!gm)

    try{
      const res = await axios.post('http://localhost:8080/chat', {room:room, user:user})
      console.log(res.data)
      if(res.status===200)
      setelt(res.data)
      }catch(err){
  
      }
  }
  return (

    // <DashBoard /> 
    <div style={{fontFamily:"OpenSans", display:"flex", alignItems:"center", flexDirection:"column"}}>
      <div className="App">
      <h1 className="p-3"><strong><span style={{color:"blue"}}>B</span>Chat</strong> A Multi Room Chat Application</h1> 
      </div>
      <Scroll rooms={roomlist} users={userlist}/>
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
      <div className = "login" style={{alignSelf:"flex-start", position:"absolute"}}>
        <h2 style={{paddingBottom:"2.5rem"}}>Filtering</h2>
        <div class="row rt">
            <div class={`neumorphic  variation2 ${dm?"pressed neumorphic--pressed" : "notpressed"}`} role="button" style={{cursor:"pointer"}} style={{cursor:"pointer"}}
            onClick={getDM}
            > 
              <h6>Get Direct Messages</h6>
            </div>
        </div>
        <div class="row rt" style={{marginTop:5}}>
            <div class={`neumorphic  variation2 ${gm?"pressed neumorphic--pressed" : "notpressed"}`} style={{cursor:"pointer"}}
            onClick={getGM}
            > 
            <h6>Get Group Messages</h6>
            </div>
        </div>
      </div>
    <h1 style={{color:"#820000"}}>Messages </h1>
     
     <div  style={{fontSize:"medium"}}>

      <ul>
        {
          (elt.length===0)?
          <li>No messages here</li>
          :
        elt
        .filter(e=> e !==null)
        .map(data => {
        
        if(dm && !data.unicast){
          return
        }
        if(dm && data.data===`${user} has joined the Room!!`){
          return
        }
        if (gm && data.unicast){
          return
        }
        if(data.type==="text")
          return <li key={data.time}>{new Date(data.time).toLocaleString()} - <span style={{color:"red"}}>{data.broadcast?`!!Global Broadcast!!`:(data.unicast?"!!Unicast!!":'!!Group Messaging!!')}</span> {data.user} {data.unicast?`-->${data.toUser}`:''} :- {data.data}</li>
        return <li key={data.time}>{new Date(data.time).toLocaleString()} - <span style={{color:"red"}}>{data.broadcast?`!!Global Broadcast!!`:(data.unicast?"!!Unicast!!":'!!Group Messaging!!')}</span> {data.user} {data.unicast?`-->${data.toUser}`:''}:- <img src={data.data} height="256" width="300"/></li>

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
