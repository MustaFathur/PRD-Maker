import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-base-100 p-4 border-r border-gray-300">
      <div className="mb-4">
        <Link to="/">
          <img src="/images/Logo-Algo.jpeg" alt="Logo" className="h-16 w-16 rounded-full mx-auto" />
        </Link>
      </div>
      <ul className="menu p-4">
        <li>
          <Link to="/dashboard" className="btn bg-base-100 mb-4 border-gray-300">Dashboard</Link>
        </li>
        <li>
          <Link to="/prd-list" className="btn bg-base-100 mb-4 border-gray-300">PRD</Link>
        </li>
        <li>
          <Link to="/personil" className="btn bg-base-100 mb-4 border-gray-300  ">Personil</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;