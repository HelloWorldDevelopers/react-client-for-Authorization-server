import React, { useState } from 'react';
import './Footer.css'

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  return (
      <div className='footer'>
        &copy; Copyright {currentYear} Rabbit and Tortoise Technology Solutions.
      </div>
  );
};

export default Footer;