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
export const UserContext = React.createContext(null);
export const UserActive = React.createContext(null);
export const UserMovements = React.createContext(null);

function App() {
  return (
    <>
      <UserContext.Provider
        value={{
          users: [
            {
              name: "Abel",
              email: "abel@mit.edu",
              password: "secret123",
              balance: 0,
              isActive: false,
            },
          ],
        }}
      >
        <UserActive.Provider value={{ name: "", email:"", balance: 0 }}>
          <UserMovements.Provider value = {{movements: []}}>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="index.html" element={<Home />} />
              <Route path="Home" element={<Home />} />
              <Route path="Login" element={<Login />} />
              <Route path="Withdraw" element={<Withdraw />} />
              <Route path="Deposit" element={<Deposit />} />
              <Route path="Createaccount" element={<Createaccount />} />
              <Route path="Accountdetails" element={<Accountdetails/>} />
            </Routes>
          </BrowserRouter>
          </UserMovements.Provider>
        </UserActive.Provider>
      </UserContext.Provider>
    </>
  );
}

export default App;
