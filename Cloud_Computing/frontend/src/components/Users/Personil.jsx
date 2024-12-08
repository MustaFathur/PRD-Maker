import React, { useEffect, useState } from 'react';
import Sidebar from '../Layout/Sidebar';
import Navbar from '../Layout/Navbar';

const Personil = () => {
  const [personil, setPersonil] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [personilToDelete, setPersonilToDelete] = useState(null);
  const [newPersonilName, setNewPersonilName] = useState('');
  const [newPersonilRole, setNewPersonilRole] = useState('');
  const [editPersonilId, setEditPersonilId] = useState(null);
  const [editPersonilName, setEditPersonilName] = useState('');
  const [editPersonilRole, setEditPersonilRole] = useState('');
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    const fetchPersonil = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/personil', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch personil data');
        }

        const data = await response.json();
        setPersonil(data);
      } catch (error) {
        console.error('Error fetching personil data:', error);
        setError(error.message);
      }
    };

    fetchPersonil();
  }, []);

  const handleCreatePersonil = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/personil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personil_name: newPersonilName, role: newPersonilRole }),
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error('Failed to create personil');
      }

      const newPersonil = await response.json();
      setPersonil([...personil, newPersonil]);
      setNewPersonilName('');
      setNewPersonilRole('');
      setIsModalOpen(false);
      setAlertMessage('Personil created successfully!');
      setIsAlertOpen(true);
    } catch (error) {
      console.error('Error creating personil:', error);
      setError(error.message);
    }
  };

  const handleUpdatePersonil = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/personil/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personil_name: editPersonilName, role: editPersonilRole }),
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error('Failed to update personil');
      }

      const updatedPersonil = await response.json();
      setPersonil(personil.map(p => (p.personil_id === id ? updatedPersonil : p)));
      setEditPersonilId(null);
      setEditPersonilName('');
      setEditPersonilRole('');
      setAlertMessage('Personil updated successfully!');
      setIsAlertOpen(true);
    } catch (error) {
      console.error('Error updating personil:', error);
      setError(error.message);
    }
  };

  const handleDeletePersonil = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/personil/${personilToDelete}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error('Failed to delete personil');
      }

      setPersonil(personil.filter(p => p.personil_id !== personilToDelete));
      setPersonilToDelete(null);
      setIsDeleteConfirmOpen(false);
      setAlertMessage('Personil deleted successfully!');
      setIsAlertOpen(true);
    } catch (error) {
      console.error('Error deleting personil:', error);
      setError(error.message);
    }
  };

  const openDeleteConfirmModal = (id) => {
    setPersonilToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Personil Management</h1>
            <button className="btn btn-neutral" onClick={() => setIsModalOpen(true)}>Add Personil</button>
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-white shadow-lg rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 w-1/2">Name</th>
                  <th className="px-4 py-2 w-1/4">Role</th>
                  <th className="px-4 py-2 w-1/4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {personil.map(p => (
                  <tr key={p.personil_id}>
                    <td className="border px-4 py-2">
                      {editPersonilId === p.personil_id ? (
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={editPersonilName}
                          onChange={(e) => setEditPersonilName(e.target.value)}
                        />
                      ) : (
                        <span>{p.personil_name}</span>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {editPersonilId === p.personil_id ? (
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={editPersonilRole}
                          onChange={(e) => setEditPersonilRole(e.target.value)}
                        />
                      ) : (
                        <span>{p.role}</span>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {editPersonilId === p.personil_id ? (
                        <div className="flex space-x-2">
                          <button className="btn btn-neutral" onClick={() => handleUpdatePersonil(p.personil_id)}>Save</button>
                          <button className="btn btn-active" onClick={() => setEditPersonilId(null)}>Cancel</button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button className="btn btn-active" onClick={() => { setEditPersonilId(p.personil_id); setEditPersonilName(p.personil_name); setEditPersonilRole(p.role); }}>Edit</button>
                          <button className="btn btn-neutral" onClick={() => openDeleteConfirmModal(p.personil_id)}>Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Adding Personil */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Personil</h2>
            <input
              type="text"
              className="input input-bordered w-full mb-4"
              placeholder="Personil Name"
              value={newPersonilName}
              onChange={(e) => setNewPersonilName(e.target.value)}
            />
            <input
              type="text"
              className="input input-bordered w-full mb-4"
              placeholder="Role"
              value={newPersonilRole}
              onChange={(e) => setNewPersonilRole(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-neutral" onClick={handleCreatePersonil}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this personil?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button className="btn" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</button>
              <button className="btn btn-neutral" onClick={handleDeletePersonil}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {isAlertOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Alert</h2>
            <p>{alertMessage}</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button className="btn" onClick={() => setIsAlertOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personil;