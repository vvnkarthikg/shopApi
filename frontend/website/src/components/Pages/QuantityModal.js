// components/QuantityModal.js
import React from 'react';
import './QuantityModal.css'; // Import CSS for styling

const QuantityModal = ({ isOpen, onClose, onConfirm }) => {
    const [quantity, setQuantity] = React.useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(quantity);
        onClose(); // Close modal after confirming
    };

    if (!isOpen) return null; // Don't render if not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Enter Quantity</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="number" 
                        value={quantity} 
                        min="1" 
                        onChange={(e) => setQuantity(e.target.value)} 
                        required 
                    />
                    <button type="submit">Confirm</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default QuantityModal;