import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import Navbar from '../Layout/Navbar';
import api from '../../utils/api';

const PRDList = () => {
  const [prdList, setPrdList] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchPRDList = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/prd?stage=${filter === 'all' ? '' : filter}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch PRD list');
        }

        const data = await response.json();
        setPrdList(data);
      } catch (error) {
        console.error('Error fetching PRD list:', error);
        setError(error.message);
      }
    };

    fetchPRDList();
  }, [filter]);

  const handleDownload = async (id) => {
    try {
      const response = await api.get(`/prd/download/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PRD_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PRD:', error);
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">PRD List</h1>
            <Link to="/create-prd" className="btn btn-primary">Add New PRD</Link>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <label className="mr-2">Filter by Stage:</label>
              <select
                className="input input-bordered"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prdList.map(prd => (
              <div key={prd.prd_id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">{prd.product_name}</h2>
                  <p className="text-gray-700 mb-1"><strong>Owner:</strong> {prd.document_owner}</p>
                  <p className="text-gray-700 mb-1"><strong>Stage:</strong> {prd.document_stage}</p>
                </div>
                <div className="flex justify-between mt-4">
                  <Link to={`/prd/${prd.prd_id}`} className="btn btn-primary">View PRD</Link>
                  <button className="btn btn-secondary" onClick={() => handleDownload(prd.prd_id)}>Download PRD</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDList;