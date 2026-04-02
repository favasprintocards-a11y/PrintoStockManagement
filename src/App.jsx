import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Inventory from './pages/Inventory';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="dashboard-container">
                <Sidebar />
                <Routes>
                    <Route path="/" element={<Navigate to="/inventory" />} />
                    <Route path="/inventory" element={<Inventory />} />
                    {/* All other routes removed to focus on specified functions */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
