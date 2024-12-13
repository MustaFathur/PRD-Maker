import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import Navbar from '../Layout/Navbar';
import { MoreVertical, Edit2, Trash2, Download, Notebook, Plus, Archive } from 'lucide-react';
import api from '../../utils/api';

const PRDList = () => {
  const [prdList, setPrdList] = useState([]);
  const [error, setError] = useState(null);
  const [filterStage, setFilterStage] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
  const [selectedPrdId, setSelectedPrdId] = useState(null); // Track the selected PRD for deletion
  const [selectedArchivePrdId, setSelectedArchivePrdId] = useState(null); // Track the selected PRD for archiving
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPRDList = async () => {
      try {
        const stageQuery = filterStage === 'all' ? '' : `stage=${filterStage}`;
        const userQuery = filterUser === 'all' ? '' : `userFilter=${filterUser}`;
        const query = [stageQuery, userQuery].filter(Boolean).join('&');

        const response = await api.get(`/prd?${query}`, { withCredentials: true });

        if (response.status !== 200) {
          throw new Error('Failed to fetch PRD list');
        }

        const data = response.data;
        setPrdList(data);
      } catch (error) {
        console.error('Error fetching PRD list:', error);
        setError(error.message);
      }
    };

    fetchPRDList();
  }, [filterStage, filterUser]);

  const handleArchive = async () => {
    try {
      await api.put(`/prd/archive/${selectedArchivePrdId}`, { status: 'completed' });
      setPrdList(prdList.map(prd => prd.prd_id === selectedArchivePrdId ? { ...prd, document_stage: 'completed' } : prd));
      setSelectedArchivePrdId(null);
      document.getElementById('archive_modal').close();
    } catch (error) {
      console.error('Error archiving PRD:', error);
      setError(error.message);
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await api.get(`/prd/download/${id}`);
      const { url } = response.data;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error downloading PRD:', error);
      setError(error.message);
    }
  };
  
  const handleDeletePrd = async () => {
    try {
      await api.delete(`/prd/${selectedPrdId}`);
      setPrdList(prdList.filter((prd) => prd.prd_id !== selectedPrdId));
      setSelectedPrdId(null);
      document.getElementById('delete_modal').close();
    } catch (error) {
      console.error('Error deleting PRD:', error);
      setError(error.message);
    }
  };

  const toggleDropdown = (prdId) => {
    setOpenDropdown(openDropdown === prdId ? null : prdId);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">PRD List</h1>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <label className="mr-2">Filter by Stage:</label>
              <select
                className="input input-bordered"
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="mr-2">Filter by User:</label>
              <select
                className="input input-bordered"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
              >
                <option value="all">All</option>
                <option value="current">Current User</option>
              </select>
            </div>
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Add New PRD Card */}
            <div
              onClick={() => navigate('/create-prd')}
              className="bg-gray-200 rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow flex items-center justify-center cursor-pointer h-48"
            >
              <Plus className="h-12 w-12 text-black" />
            </div>
            {prdList.map(prd => (
              <div
                key={prd.prd_id}
                className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow relative h-48 cursor-pointer"
                onClick={() => navigate(`/prd/${prd.prd_id}`)} // Navigate to PRD Detail page
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Notebook className="h-12 w-12 text-blue-500 mr-4" />
                    <h2 className="text-xl font-semibold text-gray-700">{prd.product_name}</h2>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      toggleDropdown(prd.prd_id);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <p className="text-gray-500 text-sm mt-2"><strong>Owner:</strong> {prd.document_owner}</p>
                <p className="text-gray-500 text-sm"><strong>Stage:</strong> {prd.document_stage}</p>
                <p className="text-gray-500 text-sm"><strong>Added by:</strong> {prd.user_name}</p>
                {openDropdown === prd.prd_id && (
                  <div className="absolute top-12 right-4 bg-white border border-gray-200 shadow-md rounded-lg w-40 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        navigate(`/prd/${prd.prd_id}/edit`); // Redirect to PRDEdit page
                      }}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        handleDownload(prd.prd_id);
                      }}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        setSelectedArchivePrdId(prd.prd_id);
                        document.getElementById('archive_modal').showModal();
                      }}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        setSelectedPrdId(prd.prd_id);
                        document.getElementById('delete_modal').showModal();
                      }}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this PRD?</p>
          <div className="modal-action">
            <button className="btn btn-neutral" onClick={handleDeletePrd}>Yes, Delete</button>
            <button className="btn btn-ghost" onClick={() => document.getElementById('delete_modal').close()}>Cancel</button>
          </div>
        </div>
      </dialog>
      <dialog id="archive_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Confirm Archiving</h3>
          <p className="py-4">Are you sure you want to archive this PRD?</p>
          <div className="modal-action">
            <button className="btn btn-neutral" onClick={handleArchive}>Yes, Archive</button>
            <button className="btn btn-ghost" onClick={() => document.getElementById('archive_modal').close()}>Cancel</button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PRDList;