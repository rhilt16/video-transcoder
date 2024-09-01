import logo from './logo.svg';
import './App.css';
// Import axios to post Request
import axios from 'axios'
// Create State for variables
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route, useNavigate
} from "react-router-dom";
import Upload from "./upload.js";
import Login from "./login.js";

function App() {
  return (
    <div className="App">
        <Router>
            
            <Routes>
                <Route exact path="/upload" element={<Upload />} />
                <Route exact path="/login" element={<Login />} />
            </Routes>
        </Router>
        
        </div>
    
);
}

export default App;
