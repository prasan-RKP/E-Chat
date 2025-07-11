import React from 'react';

const Email = ({ name, id }) => {
  const emailStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '500px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  };

  const buttonStyle = {
    display: 'inline-block',
    padding: '12px 20px',
    margin: '10px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#007BFF',
    textDecoration: 'none',
    borderRadius: '5px',
  };

  const textStyle = {
    fontSize: '16px',
    color: '#555',
  };

  return (
    <div style={emailStyle}>
      <h2 style={{ color: '#333' }}>Email Verification</h2>
      <p style={textStyle}>Hi <strong>{name}</strong>,</p>
      <p style={textStyle}>Please click the button below to verify your email:</p>
      <a href={`http://localhost:3000/verify?id=${id}`} style={buttonStyle}>
        Verify Email
      </a>
      <p style={{ fontSize: '14px', color: '#777' }}>
        If you didn’t request this verification, you can safely ignore this email.
      </p>
      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ddd' }} />
      <p style={{ fontSize: '12px', color: '#aaa' }}>
        &copy; 2025 Your Company Name. All rights reserved.
      </p>
    </div>
  );
};

export default Email;