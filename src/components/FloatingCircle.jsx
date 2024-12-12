import React from 'react';

const FloatingCircle = () => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        backgroundColor: '#fff',
        borderRadius: '50%',
        width: 50,
        height: 50,
        boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
        cursor: 'pointer',
      }}
    >
        <h4>h</h4>
      {/* Add your design elements here, e.g., an icon or text */}
      <i className="fas fa-circle" style={{ fontSize: 24, color: '#333' }} />
    </div>
  );
};

export default FloatingCircle;