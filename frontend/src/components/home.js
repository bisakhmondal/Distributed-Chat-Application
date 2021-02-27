import React from "react"
import "./home.css"
import Login from "./login"

const Home = () => {

    const [username, setUsername] = React.useState('');
    const [room, setRoom] = React.useState('');
    const [clicked, setClicked] = React.useState(false);

    const join = () => {
      setClicked(!clicked)

    }
    return(
    <div className="App">
      <h1 className="p-3"><strong><span style={{color:"blue"}}>B</span>Chat</strong> A Multi Room Chat Application</h1> 
      <header className="App-header">
        <div className="element" style={{flexDirection:"column"}}>
        <h3 style={{paddingBottom:"1rem", paddingTop:0}}>Join Room</h3>
        {/* <br /> */}
        <div>
      <input type="text" className="neumorphic" required placeholder="Username (required)"
       style={{marginBottom:10}}
       value={username}
           onChange={e => setUsername(e.target.value)}
       />
      <input type="text" className="neumorphic" 
       placeholder="Room (default: #general)"
        style={{marginBottom:30}}
        value={room}
            onChange={e => setRoom(e.target.value)}
        />
      {/* <input type="submit" class="fadeIn fourth" value="Log In"> */}
            <div class={`neumorphic  variation2 ${clicked?"pressed neumorphic--pressed" : "notpressed"}`} role="button" style={{cursor:"pointer"}} onClick={join}>
                <span><strong>Join</strong></span>
            </div>
    </div>

        </div>
      <Login />
      </header>
    </div>
    )
}

export default Home;
