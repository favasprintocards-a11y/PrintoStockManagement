import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Minus, X, Loader2, Pencil, Trash2, History, Calendar, User, ArrowLeft } from 'lucide-react';

// Ensure the base URL is correct for both local and production environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/products`;

const Inventory = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const initialParty = location.state?.selectedParty || '';
    const [showAddModal, setShowAddModal] = useState(false); // To create new item
    const [showEditModal, setShowEditModal] = useState(false);
    const [showMinusModal, setShowMinusModal] = useState(false);
    const [showPlusModal, setShowPlusModal] = useState(false); // To add to existing stock
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productHistory, setProductHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Form states
    const [formData, setFormData] = useState({ name: '', quantity: '' });
    const [transactionData, setTransactionData] = useState({ quantity: '', party: initialParty });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const queryParam = initialParty ? `?party=${encodeURIComponent(initialParty)}` : '';
            const res = await fetch(`${API_URL}${queryParam}`);
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowAddModal(false);
                setFormData({ name: '', quantity: '' });
                fetchProducts();
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Error adding stock');
            }
        } catch (error) {
            console.error('Error adding stock:', error);
        }
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/${selectedProduct._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowEditModal(false);
                setFormData({ name: '', quantity: '' });
                fetchProducts();
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Error updating stock');
            }
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this stock?')) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchProducts();
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Error deleting stock');
            }
        } catch (error) {
            console.error('Error deleting stock:', error);
        }
    };

    const handleUpdateStock = async (e, type) => {
        e.preventDefault();
        
        // Use initialParty if no party name provided
        const partyName = transactionData.party || 'Stock Added';

        try {
            const res = await fetch(`${API_URL}/update-stock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: selectedProduct._id,
                    type: type, // 'IN' or 'OUT'
                    quantity: transactionData.quantity,
                    party: partyName
                }),
            });
            if (res.ok) {
                setShowPlusModal(false);
                setShowMinusModal(false);
                setTransactionData({ quantity: '', party: initialParty });
                fetchProducts();
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Error updating stock');
            }
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    const fetchHistory = async (productId) => {
        try {
            setLoadingHistory(true);
            const res = await fetch(`${API_URL}/${productId}/history`);
            const data = await res.json();
            setProductHistory(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching history:', error);
            setProductHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    return (
        <main className="main-content">
            <header className="top-bar">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h1 className="page-title">Stock Management</h1>
                    {initialParty && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                            <User size={16} /> Viewing for Party: {initialParty}
                        </div>
                    )}
                </div>
                <div className="top-bar-actions">
                    <button className="btn-primary" onClick={() => { setFormData({ name: '', quantity: '' }); setShowAddModal(true); }} style={{ background: 'var(--secondary)', borderColor: 'var(--secondary)' }}>
                        <Plus size={18} /> New Stock Entry
                    </button>
                </div>
            </header>

            <div className="content-wrapper">
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Loader2 className="animate-spin" style={{ margin: '0 auto 10px' }} />
                        Loading...
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Stock Name</th>
                                <th>{initialParty ? `${initialParty}'s Balanced Stock` : 'Total Quantity in Warehouse'}</th>
                                <th style={{ textAlign: 'right' }}>Update Stock</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? products.map((item) => (
                                <tr key={item._id}>
                                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                                    <td style={{ fontWeight: 600, fontSize: '1.2rem' }}>
                                        {initialParty ? item.partyBalance : item.quantity}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button 
                                                className="btn-primary" 
                                                style={{ background: 'var(--secondary)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}
                                                onClick={() => {
                                                    setSelectedProduct(item);
                                                    setTransactionData({ quantity: '', party: initialParty });
                                                    setShowPlusModal(true);
                                                }}
                                            >
                                                <Plus size={14} /> Add
                                            </button>
                                            <button 
                                                className="btn-primary" 
                                                style={{ background: '#ef4444', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}
                                                onClick={() => {
                                                    setSelectedProduct(item);
                                                    setTransactionData({ quantity: '', party: initialParty });
                                                    setShowMinusModal(true);
                                                }}
                                            >
                                                <Minus size={14} /> Minus
                                            </button>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button 
                                                style={{ background: '#f1f5f9', color: '#475569', padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                                title="View History"
                                                onClick={() => {
                                                    setSelectedProduct(item);
                                                    setShowHistoryModal(true);
                                                    fetchHistory(item._id);
                                                }}

                                            >
                                                <History size={16} />
                                            </button>
                                            <button 
                                                style={{ background: '#f1f5f9', color: 'var(--primary)', padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                                onClick={() => {
                                                    setSelectedProduct(item);
                                                    setFormData({ name: item.name, quantity: item.quantity });
                                                    setShowEditModal(true);
                                                }}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button 
                                                style={{ background: '#fef2f2', color: '#ef4444', padding: '6px', borderRadius: '6px', border: '1px solid #fee2e2' }}
                                                onClick={() => handleDeleteProduct(item._id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        No items. Click "New Stock Entry" to start.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* New Stock Modal (for new product) */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>Create New Stock Entry</h2>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateProduct}>
                            <div className="form-group">
                                <label>Stock Name</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    required 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Initial Quantity</label>
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    required 
                                    min="0"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2, background: 'var(--secondary)' }}>Save Entry</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Stock Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>Edit Stock Name/Base</h2>
                            <button onClick={() => setShowEditModal(false)} style={{ background: 'transparent' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleEditProduct}>
                            <div className="form-group">
                                <label>Stock Name</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    required 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Adjust Total Quantity</label>
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    required 
                                    min="0"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2, background: 'var(--primary)' }}>Update Stock</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PLUS Stock Modal */}
            {showPlusModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h2 style={{ fontSize: '1.25rem', color: 'var(--secondary)' }}>
                                {initialParty ? `Return from ${initialParty}` : 'Add Stock'}
                            </h2>
                            <button onClick={() => setShowPlusModal(false)} style={{ background: 'transparent' }}><X size={20} /></button>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                            Adding to: <strong>{selectedProduct?.name}</strong>
                        </p>
                        <form onSubmit={(e) => handleUpdateStock(e, 'IN')}>
                            <div className="form-group">
                                <label>Quantity to ADD</label>
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    required 
                                    min="1"
                                    value={transactionData.quantity}
                                    onChange={(e) => setTransactionData({...transactionData, quantity: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>From Which Party?</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    required 
                                    placeholder="Enter Party Name / Source"
                                    value={transactionData.party}
                                    onChange={(e) => setTransactionData({...transactionData, party: e.target.value})}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowPlusModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2, background: 'var(--secondary)' }}>Confirm Addition</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MINUS Stock Modal */}
            {showMinusModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h2 style={{ fontSize: '1.25rem', color: '#ef4444' }}>Minus Stock</h2>
                            <button onClick={() => setShowMinusModal(false)} style={{ background: 'transparent' }}><X size={20} /></button>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                            Subtracting from: <strong>{selectedProduct?.name}</strong> (Available: {selectedProduct?.quantity})
                        </p>
                        <form onSubmit={(e) => handleUpdateStock(e, 'OUT')}>
                            <div className="form-group">
                                <label>Quantity to Subtract</label>
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    required 
                                    min="1"
                                    max={selectedProduct?.quantity}
                                    value={transactionData.quantity}
                                    onChange={(e) => setTransactionData({...transactionData, quantity: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>To Which Party Goes the Stock?</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    required 
                                    placeholder="Enter Party Name / Recipient"
                                    value={transactionData.party}
                                    onChange={(e) => setTransactionData({...transactionData, party: e.target.value})}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowMinusModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2, background: '#ef4444' }}>Deduct Stock</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* History Modal */}
            {showHistoryModal && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '700px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>Stock Activity History</h2>
                            <button onClick={() => setShowHistoryModal(false)} style={{ background: 'transparent' }}><X size={20} /></button>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Stock: <strong>{selectedProduct?.name}</strong>
                        </p>
                        
                        <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }} className="history-table-container">
                            {loadingHistory ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <Loader2 className="animate-spin" style={{ margin: '0 auto 10px' }} />
                                    Loading history...
                                </div>
                            ) : (
                                <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9rem', minWidth: '450px' }}>
                                    <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1 }}>
                                        <tr>
                                            <th style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>Date</th>
                                            <th style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>Type</th>
                                            <th style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>Qty</th>
                                            <th style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>Source/Party</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productHistory.length > 0 ? (
                                            [...productHistory]
                                                .reverse()
                                                .map((t, index) => (
                                                    <tr key={index}>
                                                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                                                            {new Date(t.date).toLocaleDateString()}
                                                        </td>
                                                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                                                            <span className={`badge ${t.type === 'IN' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                                                                {t.type === 'IN' ? 'ADDED' : 'MINUS'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, color: t.type === 'IN' ? 'var(--secondary)' : '#ef4444' }}>
                                                            {t.type === 'IN' ? '+' : '-'}{t.quantity}
                                                        </td>
                                                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                                                            {t.party}
                                                        </td>
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                                                    No activity history found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>


                        
                        <div className="modal-actions" style={{ marginTop: '24px' }}>
                            <button type="button" className="btn-primary" style={{ flex: 1 }} onClick={() => setShowHistoryModal(false)}>Close History</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Inventory;
