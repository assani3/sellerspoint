// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './Views/HomePage'; // This is your landing page with Header.js
import Home from './Views/Home'; // This is the new Home page we created

//new testing
import Product from './Views/Product';
import Signin from './Views/Signin';
import Signup from './Views/Signup';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Home />} />

          
          <Route path="/product" element={<Product/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/signup" element={<Signup/>}/>
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;