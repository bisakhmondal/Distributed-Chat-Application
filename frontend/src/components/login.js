import React from "react"
import "./login.css"
import google from "./google.png"

const Login = () =>{
    return(
        <div className = "login">
        <h2 style={{paddingBottom:"2.5rem"}}>Sign In</h2>
        <div class="row rt">
            <div class="neumorphic " style={{cursor:"pointer"}}> 
                <img src= {google} height="30" width="30"/>
            </div>
        </div>
        {/* <h2 style={{paddingBottom:"0.5rem", fontFamily:"OpenSans, Arial, serif"}}>Welcome</h2>
        <div class="neumorphic " style={{cursor:"pointer"}}> 
                <img src= {google} height="30" width="30"/>
        </div>
        <div style={{padding:5, fontFamily:"Dot, Arial, serif"}} className="ow">
        <h4 >AdamDAngelomisoAdam DAngelomisoA damDAngelomiso AdamDAngelomiso</h4>
        </div> */}
              </div>
    )
}


export default Login;