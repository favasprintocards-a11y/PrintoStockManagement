import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="logo-container" style={{ marginBottom: '3rem', cursor: 'default' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* Link to the actual image file */}
                    <img
                        src="/PrintoLogoPNG.png"
                        alt="Printo Logo"
                        style={{ width: '100%', height: 'auto', maxWidth: '100%', maxHeight: '290px', objectFit: 'contain' }}
                        onError={(e) => {
                            // Fallback if image not found
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
                    to="/inventory"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Package size={20} />
                    <span className="label">Stock Management</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
