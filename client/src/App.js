import React from "react";
import Navbar from "./Components/Navbar";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Body/Login";
import Withdraw from "./Components/Body/Withdraw";
import Deposit from "./Components/Body/Deposit";
import Createaccount from "./Components/Body/Createaccount";
import Home from "./Components/Body/Home";
import Accountdetails from "./Components/Body/Accountdetails";


//If we use these variables inside other components (files), then we need to declare them globally
export const UserActive = React.createContext(null);

function App() {
  const [show, setShow] = React.useState(false); //to switch between user options to navigate in app
  const [nameNavbar, setNameNavbar] = React.useState(''); //To show in Navbar
  return (
    <>
        <UserActive.Provider value={{ name: "", email:"", balance: 0 }}>
          <BrowserRouter>
            <Navbar display={show} username={nameNavbar} handleDisplay={setShow} handleName={setNameNavbar}/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="index.html" element={<Home />} />
              <Route path="Home" element={<Home />} />
              <Route path="Login" element={<Login handleDisplay={setShow} handleName={setNameNavbar}/>} />
              <Route path="Withdraw" element={<Withdraw />} />
              <Route path="Deposit" element={<Deposit />} />
              <Route path="Createaccount" element={<Createaccount />} />
              <Route path="Accountdetails" element={<Accountdetails/>} />
            </Routes>
          </BrowserRouter>
        </UserActive.Provider>
    </>
  );
}

export default App;
