import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package, X, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-mobile-close">
                <button onClick={toggleSidebar}><X size={24} /></button>
            </div>
            <div className="logo-container" style={{ cursor: 'default' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%', justifyContent: 'center' }}>
                    <img
                        src="/PrintoLogoPNG.png"
                        alt="Printo Logo"
                        style={{ width: '100%', height: 'auto', maxWidth: '180px', maxHeight: '180px', objectFit: 'contain' }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'block';
                            }
                        }}
                    />
                    <div style={{ display: 'none' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Printo Stock</span>
                    </div>
                </div>
            </div>

            <nav className="nav-links">
                <NavLink
                    to="/"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                        if (window.innerWidth <= 768) {
                            toggleSidebar();
                        }
                    }}
                >
                    <LayoutDashboard size={20} />
                    <span className="label">Dashboard</span>
                </NavLink>
                <NavLink
                    to="/inventory"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                        if (window.innerWidth <= 768) {
                            toggleSidebar();
                        }
                    }}
                >
                    <Package size={20} />
                    <span className="label">Stock Management</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;

