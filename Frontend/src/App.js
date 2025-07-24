import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthorizationContext from './context/AuthorizationContext';
import './App.css';
import MainPage from "./views/MainPage"
import NotFound from './views/NotFound';

export default function App() {
  const [contextUser, contextSetUser] = useState({
    username: "",
    role: "Guest",
    jwtToken: "",
    email: "",
    picture: "",
    bio: ""
  });

  const APIUrl = "http://localhost:5000/";
  const value = { APIUrl, contextUser, contextSetUser };

  // var storageUser = localStorage.getItem("ReadfeedUser");
  // if (contextUser.role === "Guest" && storageUser) {
  //   var storageUserJson = JSON.parse(storageUser);
  //   contextSetUser(storageUserJson);
  // }

  return (
    <AuthorizationContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthorizationContext.Provider>
  );
}