import React, { useState, useEffect } from 'react';
import { Plus, Users, Trash2, ArrowRight, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/parties`;

const Dashboard = () => {
    const [parties, setParties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchParties();
    }, []);

    const fetchParties = async () => {
        try {
            setLoading(true);
            const res = await fetch(API_URL);
            const data = await res.json();
            setParties(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching parties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateParty = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowAddModal(false);
                setFormData({ name: '', phone: '', address: '' });
                fetchParties();
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Error adding party');
            }
        } catch (error) {
            console.error('Error adding party:', error);
        }
    };

    const handleDeleteParty = async (id, e) => {
        e.stopPropagation(); // Avoid triggering navigation
        if (!window.confirm('Are you sure you want to delete this party?')) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchParties();
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Error deleting party');
            }
        } catch (error) {
            console.error('Error deleting party:', error);
        }
    };

    return (
        <main className="main-content">
            <header className="top-bar">
                <h1 className="page-title">Dashboard</h1>
                <div className="top-bar-actions">
                    <button className="btn-primary" onClick={() => { setFormData({ name: '', phone: '', address: '' }); setShowAddModal(true); }} style={{ background: 'var(--secondary)', borderColor: 'var(--secondary)' }}>
                        <Plus size={18} /> Add Party
                    </button>
                </div>
            </header>

            <div className="content-wrapper">
                <div className="stats-header" style={{ marginBottom: '2rem', display: 'flex', gap: '20px' }}>
                    <div className="stat-card" style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--secondary)' }}>
                            <Users size={24} />
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Parties</span>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '10px' }}>{parties.length}</div>
                    </div>
                </div>

                <h2 style={{ fontSize: '1.2rem', marginBottom: '1.2rem', color: 'var(--text-main)' }}>Registered Parties</h2>
                
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Loader2 className="animate-spin" style={{ margin: '0 auto 10px' }} />
                        Loading Parties...
                    </div>
                ) : parties.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {parties.map((party) => (
                            <div 
                                key={party._id} 
                                className="party-card" 
                                style={{ 
                                    background: '#fff', 
                                    padding: '20px', 
                                    borderRadius: '12px', 
                                    boxShadow: 'var(--shadow-sm)', 
                                    border: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    position: 'relative'
                                }}
                                onClick={() => navigate('/inventory', { state: { selectedParty: party.name } })}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>{party.name}</h3>
                                    {party.phone && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📞 {party.phone}</p>}
                                    {party.address && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>📍 {party.address}</p>}
                                </div>
                                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        View Stock <ArrowRight size={14} />
                                    </span>
                                    <button 
                                        className="btn-danger" 
                                        style={{ 
                                            background: '#fef2f2', 
                                            color: '#ef4444', 
                                            padding: '8px', 
                                            borderRadius: '8px', 
                                            border: '1px solid #fee2e2' 
                                        }}
                                        onClick={(e) => handleDeleteParty(party._id, e)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px', background: '#f8fafc', borderRadius: '12px', border: '2px dashed var(--border)' }}>
                        <Users size={48} style={{ color: 'var(--border)', marginBottom: '16px' }} />
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>No Parties Added Yet</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Start by adding a vendor or a client to manage their stock transactions.</p>
                        <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add First Party</button>
                    </div>
                )}
            </div>

            {/* Add Party Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>Add New Party</h2>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateParty}>
                            <div className="form-group">
                                <label>Party Name</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    required 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone (Optional)</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    placeholder="e.g. +91 99999 99999"
                                />
                            </div>
                            <div className="form-group">
                                <label>Address (Optional)</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    placeholder="e.g. 123 Street Lane"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2, background: 'var(--secondary)' }}>Save Party</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Dashboard;
