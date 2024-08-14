import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import UserList from "./Components/Users/UserList";

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/users"
          element={<ProtectedRoute element={<UserList />} />}
        />
      </Routes>
    </div>
  );
};

export default App;
