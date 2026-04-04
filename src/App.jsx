import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import './App.css';

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Router>
            <div className="dashboard-container">
                {/* Mobile Header */}
                <header className="mobile-header">
                    <button className="menu-toggle" onClick={toggleSidebar}>
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className="mobile-brand">
                        <img src="/PrintoLogoPNG.png" alt="Printo" className="mobile-logo" />
                    </div>
                </header>

                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                
                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

                <div className="main-wrapper">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/inventory" element={<Inventory />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;

