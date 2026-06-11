import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { Chat } from "./components/Chat";
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom"
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <div className="app">
        <h1 className="text-center mt-3">Nexus Chat</h1>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/chats/:username" element={<Chat />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
