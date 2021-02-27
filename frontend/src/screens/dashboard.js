import React from "react";
import Scroll from "../components/leftscroll"


const DashBoard = () =>{
    return(

<div>

<header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
  <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 center" href="#"> <h2 style={{fontFamily:"OpenSans"}}><strong><span style={{color:"blue"}}>B</span>Chat</strong></h2></a>
  {/* <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation"> */}
    {/* <span class="navbar-toggler-icon"></span> */}
  {/* </button> */}
  <input class="form-control form-control-dark w-100 " type="text" placeholder="Search" aria-label="Search" />
  <ul class="navbar-nav px-3">
    <li class="nav-item text-nowrap">
      <a class="nav-link h6" href="#">Leave</a>
    </li>
  </ul>
</header>


<div class="container-fluid">
  <div class="row">
      <Scroll />

    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h3">#general</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
          <div class="btn-group me-2">
            <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
            <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
          </div>
          <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
            <span data-feather="calendar"></span>
            This week
          </button>
        </div>
      </div>

      <canvas class="my-4 w-100"  width="900" height="380">
      </canvas>
        <h1>Hello</h1>
      </main>
  </div>
  </div>

</div>




    )
} ;

export default DashBoard;