import React from 'react';
import './Footer.css'; // Importing the provided CSS

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>&copy; 2024 Sri Gansesh Agencies. All rights reserved.</p>
        <p>
          Contact us at: 
          <a href="mailto:info@yourcompany.com"> info@yourcompany.com</a> | 
          Phone: +91-1234567890
        </p>
        <p>
          Address: 21-22-35, Main Road, Palakollu, West Godavari, Andhra Pradesh, India
        </p>
      </div>
    </footer>
  );
};

export default Footer;
