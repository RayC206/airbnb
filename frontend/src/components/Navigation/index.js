import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import LoginFormModal from "../LoginFormModal";
import DemoUser from "../DemoUser";

import "./Navigation.css";
import CreateSpotModal from "../CreateSpot";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
    <div id='rightNav'>
    <ProfileButton user={sessionUser}/>
    </div>
      </>
    )
  } else {
    sessionLinks = (
      <div id='rightNav'>
        <LoginFormModal />
        <button><NavLink to="/signup">Sign Up</NavLink></button>
        <DemoUser />
      </div>
    );
  }
  return (
    <nav>
    <div id="navBar">
        <div id='logo_div'>
            <NavLink exact to="/">
                <img src="https://i.imgur.com/pd6aZpK.png"></img>
            </NavLink>
        </div>
        {isLoaded && sessionLinks}
    </div >
</nav >
  );
}

export default Navigation;
