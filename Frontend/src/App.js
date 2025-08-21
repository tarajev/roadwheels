import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthorizationContext from './context/AuthorizationContext';
import './App.css';
import MainPage from "./views/MainPage"
import VehiclePage from "./views/VehiclePage"
import NotFound from './views/NotFound';
import EmployeePanel from './views/EmployeePanel';
import UserProfile from './views/UserProfile'

export default function App() {
  const [contextUser, contextSetUser] = useState({
    id: "",
    name: "",
    email: "",
    role: 0,
    jwtToken: ""
  });

   const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    contextSetUser({
      id: "",
      name: "",
      email: "",
      role: 0,
      jwtToken: ""
    });
    window.location.reload();
  };

  const APIUrl = "http://localhost:5050/";
  const value = { APIUrl, contextUser, contextSetUser };

  var storageUser = localStorage.getItem("RoadWheelsUser");
  
  if (contextUser.role == 0  && storageUser) {
    var storageUserJson = JSON.parse(storageUser);
    contextSetUser(storageUserJson);
  }

  return (
    <AuthorizationContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/vehicle/:type/:vehicleId" element={<VehiclePage />} />
          <Route path="/employeePanel" element={<EmployeePanel />} />
          <Route path="/profile/:userID" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthorizationContext.Provider>
  );
}