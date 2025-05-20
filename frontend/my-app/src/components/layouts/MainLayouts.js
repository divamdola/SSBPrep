// src/components/layouts/MainLayout.js
import React from 'react';
import Header from './header';
import Footer from './footer';

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="content">
        {children}
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
