import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navigation from './components/Layout/Navigation';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TeacherList from './components/Teachers/TeacherList';
import TeacherDetail from './components/Teachers/TeacherDetail';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navigation isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <Navigate to="/teachers" /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/teachers" /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
              <Navigate to="/teachers" /> : 
              <Register onRegister={handleLogin} />
            } 
          />
          <Route 
            path="/teachers" 
            element={
              isAuthenticated ? 
              <TeacherList /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/teachers/:id" 
            element={
              isAuthenticated ? 
              <TeacherDetail /> : 
              <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

// MAKE SURE THIS EXPORT STATEMENT IS AT THE END
export default App;