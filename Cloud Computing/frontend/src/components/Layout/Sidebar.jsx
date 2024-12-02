import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-base-200 p-4 shadow-lg">
      <div className="mb-4">
        <Link to="/">
          <img src="/images/Logo-Algo.jpeg" alt="Logo" className="h-12 mx-auto" />
        </Link>
      </div>
      <ul className="menu p-4">
        <li>
          <Link to="/dashboard" className="btn btn-block">Dashboard</Link>
        </li>
        <li>
          <Link to="/prd-list" className="btn btn-block">PRD</Link>
        </li>
        <li>
          <Link to="/personil" className="btn btn-block">Personil</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;