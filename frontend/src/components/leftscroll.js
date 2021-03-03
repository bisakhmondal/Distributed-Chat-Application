import React from "react"
import "./leftscroll.css"
const Scroll = ({rooms}) =>{
  const elts = rooms.map(r =>{
    return(
        <li class="nav-item">
            <div class="nav-link">
              <h6>{r}</h6>
            </div>
          </li>
    )
  })
    return(
        <div>
    <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div class="position-sticky pt-3">
        <ul class="nav flex-column">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">
              <span data-feather="home"></span>
              <h4>Public Available Rooms </h4> 
            </a>
          </li>
          {elts}
        </ul>

      </div>
    </nav>
    </div>
    )
};

export default Scroll;