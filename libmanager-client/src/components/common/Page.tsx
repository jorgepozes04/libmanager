import React from 'react';
import './Page.css';

interface PageProps {
  title: string;
  children: React.ReactNode;
}

const Page = ({ title, children }: PageProps) => {
  return (
    // O div 'page-container' foi removido para simplificar o layout
    <>
      <h1 className="page-title">{title}</h1>
      <div className="page-card">
        {children}
      </div>
    </>
  );
};

export default Page;