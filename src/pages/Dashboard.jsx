import React, { useState, useEffect } from 'react';
import { Plus, Users, Trash2, ArrowRight, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/parties`;

const Dashboard = () => {
    const [parties, setParties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({ name: '' });
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
                setFormData({ name: '' });
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
                    <button className="btn-primary" onClick={() => { setFormData({ name: '' }); setShowAddModal(true); }} style={{ background: 'var(--secondary)', borderColor: 'var(--secondary)' }}>
                        <Plus size={18} /> Add Party Name
                    </button>
                </div>
            </header>

            <div className="content-wrapper">
                <div className="stats-header" style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    <div className="stat-card" style={{ flex: '1 1 200px', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--secondary)' }}>
                            <Users size={24} />
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Registered Parties</span>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '10px' }}>{parties.length}</div>
                    </div>
                </div>

                <h2 style={{ fontSize: '1.1rem', marginBottom: '1.2rem', color: 'var(--text-main)', opacity: 0.8 }}>Tap a party name to view their current stock</h2>
                
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Loader2 className="animate-spin" style={{ margin: '0 auto 10px' }} />
                        Loading...
                    </div>
                ) : parties.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                        {parties.map((party) => (
                            <div 
                                key={party._id} 
                                className="party-card" 
                                style={{ 
                                    background: '#fff', 
                                    padding: '24px', 
                                    borderRadius: '12px', 
                                    boxShadow: 'var(--shadow-sm)', 
                                    border: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    position: 'relative'
                                }}
                                onClick={() => navigate('/inventory', { state: { selectedParty: party.name } })}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ background: '#f1f5f9', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{party.name}</h3>
                                        <span style={{ color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 600 }}>See Current Stock <ArrowRight size={12} /></span>
                                    </div>
                                </div>
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
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px', background: '#f8fafc', borderRadius: '12px', border: '2px dashed var(--border)' }}>
                        <Users size={48} style={{ color: 'var(--border)', marginBottom: '16px' }} />
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>No Parties Found</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Add a party name below to start managing their stock.</p>
                        <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add Party Now</button>
                    </div>
                )}
            </div>

            {/* Add Party Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>Enter Party Name</h2>
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
                                    onChange={(e) => setFormData({ name: e.target.value })}
                                    placeholder="Enter unique party name"
                                    autoFocus
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2, background: 'var(--secondary)' }}>Save Party Name</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Dashboard;
