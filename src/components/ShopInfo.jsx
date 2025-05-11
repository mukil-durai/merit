import React from 'react';
import '/src/css/ShopInfo.css';

const ShopInfo = () => {
  return (
    <div className="shop-info">
      <div className="container d-flex justify-content-end align-items-center">
        <div className="shop-details d-flex align-items-center">
          <a href="mailto:info@meritcreaters.com" className="email-link me-3">
            <i className="bi bi-envelope-fill"></i> info@meritcreaters.com
          </a>
          <span>
            <i className="bi bi-clock-fill"></i> Mon - Sat 09:30am - 06:30pm, Sunday - CLOSED
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShopInfo;
