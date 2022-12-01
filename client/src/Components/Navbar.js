import { Link } from "react-router-dom";
import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";
import { UserActive } from "../App";
import auth from "./firebaseConfig";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import axios from 'axios'

const Navbar = () => {
  const [show, setShow] = React.useState(false); //to switch between user options to navigate in app
  const user = React.useContext(UserActive); //Context to display information of the active user in the UI

  const logout = () => {
    signOut(auth);
    window.location.href = "/Home";
  }
  onAuthStateChanged(auth, (userAuth) => {
    if (userAuth) {
      console.log(userAuth);
      if(user.name == ""){
      axios.get(`${process.env.REACT_APP_API_URL}/account/find`, {
        params: {
          email: userAuth.email
        }
      }).then(function (res) {
        console.log(user);
        user.name = res.data.name;
        user.email = res.data.email;
        user.balance = res.data.balance;
      setShow(true)
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    })};
    } else {
        user.name = "";
        user.email = "";
        user.balance = 0;
      console.log("User is not logged in");
      setShow(false); //Only display options to start a session
    }
  });

  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark px-3">
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Home Page</Tooltip>}
        >
          <Link className="navbar-brand" to="/Home">
            Bad Bank
          </Link>
        </OverlayTrigger>
        <div className="container">
          {show ? (
            <>
              <ul className="navbar-nav">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Deposit to your account</Tooltip>}
                >
                  <li className="nav-item">
                    <Link className="nav-link" to="/deposit">
                      Deposit
                    </Link>
                  </li>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Withdraw from your account</Tooltip>}
                >
                  <li className="nav-item">
                    <Link className="nav-link" to="/withdraw">
                      Withdraw
                    </Link>
                  </li>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip>All movements of the logged in user</Tooltip>
                  }
                >
                  <li className="nav-item">
                    <Link className="nav-link" to="/accountdetails">
                      Account Details
                    </Link>
                  </li>
                </OverlayTrigger>
                
              </ul>
              <div className="d-flex">
                <p className="navbar-text m-3"><b>Hi {user.name}!</b></p>
                <button className="btn btn-outline-danger" onClick={logout}>log out</button>
              </div>
            </>
          ) : (
            <ul className="navbar-nav">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Create a new account with us</Tooltip>}
              >
                <li className="nav-item">
                  <Link className="nav-link" to="/createaccount">
                    Create Account
                  </Link>
                </li>
              </OverlayTrigger>

              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Login to your account</Tooltip>}
              >
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              </OverlayTrigger>
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
