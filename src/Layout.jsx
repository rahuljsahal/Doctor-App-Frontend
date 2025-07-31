import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <div className="blur-background" />
      <div className="content-overlay">{children}</div>
    </div>
  );
};

export default Layout