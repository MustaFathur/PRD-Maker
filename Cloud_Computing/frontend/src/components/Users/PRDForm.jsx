import React, { useState, useEffect } from 'react';
import Sidebar from '../Layout/Sidebar';
import Navbar from '../Layout/Navbar';
import PRDDisplay from './PRDDisplay';

const PRDForm = () => {
  const [productName, setProductName] = useState('');
  const [documentVersion, setDocumentVersion] = useState('');
  const [documentOwner, setDocumentOwner] = useState([]);
  const [developer, setDeveloper] = useState([]);
  const [stakeholder, setStakeholder] = useState([]);
  const [projectOverview, setProjectOverview] = useState('');
  const [darciRoles, setDarciRoles] = useState({
    decider: [],
    accountable: [],
    responsible: [],
    consulted: [],
    informed: []
  });
  const [selectedPersonil, setSelectedPersonil] = useState({
    documentOwner: '',
    developer: '',
    stakeholder: '',
    decider: '',
    accountable: '',
    responsible: '',
    consulted: '',
    informed: ''
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generatedPRD, setGeneratedPRD] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [personil, setPersonil] = useState([]);

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

  const handleAddPersonil = (role) => {
    if (selectedPersonil[role]) {
      setDarciRoles({
        ...darciRoles,
        [role]: [...darciRoles[role], selectedPersonil[role]]
      });
      setSelectedPersonil({ ...selectedPersonil, [role]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const prdData = {
      productName,
      documentVersion,
      documentOwner,
      developer,
      stakeholder,
      projectOverview,
      darciRoles,
      startDate,
      endDate
    };

    try {
      const response = await fetch("http://localhost:5000/api/prd/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prdData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PRD");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value);
      }

      const parsedResult = JSON.parse(result);
      setGeneratedPRD(parsedResult.prd);

    } catch (error) {
      console.error("Error generating PRD:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (generatedPRD) {
    return <PRDDisplay prdData={generatedPRD} />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg relative">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Product Requirements Document
            </h1>
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold mb-4">Create New PRD</h2>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700">Product Name</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Document Version</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={documentVersion}
                    onChange={(e) => setDocumentVersion(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Document Owner</label>
                  <div className="flex">
                    <select
                      className="input input-bordered w-full"
                      value={selectedPersonil.documentOwner}
                      onChange={(e) => setSelectedPersonil({ ...selectedPersonil, documentOwner: e.target.value })}
                    >
                      <option value="">Select Document Owner</option>
                      {personil.filter(user => !documentOwner.includes(user.personil_id)).map((user) => (
                        <option key={user.personil_id} value={user.personil_id}>
                          {user.personil_name}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="btn btn-secondary ml-2" onClick={() => setDocumentOwner([...documentOwner, selectedPersonil.documentOwner])}>
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap">
                    {documentOwner.map((id) => (
                      <div key={id} className="flex items-center mr-2 mb-2">
                        <span className="badge badge-primary mr-2">
                          {personil.find((user) => user.personil_id === id)?.personil_name}
                        </span>
                        <button
                          type="button"
                          className="btn btn-xs btn-error"
                          onClick={() => setDocumentOwner(documentOwner.filter((owner) => owner !== id))}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Developer</label>
                  <div className="flex">
                    <select
                      className="input input-bordered w-full"
                      value={selectedPersonil.developer}
                      onChange={(e) => setSelectedPersonil({ ...selectedPersonil, developer: e.target.value })}
                    >
                      <option value="">Select Developer</option>
                      {personil.filter(user => !developer.includes(user.personil_id)).map((user) => (
                        <option key={user.personil_id} value={user.personil_id}>
                          {user.personil_name}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="btn btn-secondary ml-2" onClick={() => setDeveloper([...developer, selectedPersonil.developer])}>
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap">
                    {developer.map((id) => (
                      <div key={id} className="flex items-center mr-2 mb-2">
                        <span className="badge badge-primary mr-2">
                          {personil.find((user) => user.personil_id === id)?.personil_name}
                        </span>
                        <button
                          type="button"
                          className="btn btn-xs btn-error"
                          onClick={() => setDeveloper(developer.filter((dev) => dev !== id))}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Stakeholder</label>
                  <div className="flex">
                    <select
                      className="input input-bordered w-full"
                      value={selectedPersonil.stakeholder}
                      onChange={(e) => setSelectedPersonil({ ...selectedPersonil, stakeholder: e.target.value })}
                    >
                      <option value="">Select Stakeholder</option>
                      {personil.filter(user => !stakeholder.includes(user.personil_id)).map((user) => (
                        <option key={user.personil_id} value={user.personil_id}>
                          {user.personil_name}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="btn btn-secondary ml-2" onClick={() => setStakeholder([...stakeholder, selectedPersonil.stakeholder])}>
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap">
                    {stakeholder.map((id) => (
                      <div key={id} className="flex items-center mr-2 mb-2">
                        <span className="badge badge-primary mr-2">
                          {personil.find((user) => user.personil_id === id)?.personil_name}
                        </span>
                        <button
                          type="button"
                          className="btn btn-xs btn-error"
                          onClick={() => setStakeholder(stakeholder.filter((stake) => stake !== id))}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4 md:col-span-2">
                  <label className="block text-gray-700">Project Overview</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    value={projectOverview}
                    onChange={(e) => setProjectOverview(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Start Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">End Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <fieldset className="border border-gray-300 rounded-lg p-6 mb-4">
                <legend className="text-xl font-semibold text-gray-700">DARCI Roles</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(darciRoles).map((role) => (
                    <div key={role} className="mb-4">
                      <label className="block text-gray-700 capitalize">{role}</label>
                      <div className="flex">
                        <select
                          className="input input-bordered w-full"
                          value={selectedPersonil[role]}
                          onChange={(e) => setSelectedPersonil({ ...selectedPersonil, [role]: e.target.value })}
                        >
                          <option value="">Select {role}</option>
                          {personil.filter(user => !darciRoles[role].includes(user.personil_id)).map((user) => (
                            <option key={user.personil_id} value={user.personil_id}>
                              {user.personil_name}
                            </option>
                          ))}
                        </select>
                        <button type="button" className="btn btn-secondary ml-2" onClick={() => handleAddPersonil(role)}>
                          Add
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap">
                        {darciRoles[role].map((id) => (
                          <div key={id} className="flex items-center mr-2 mb-2">
                            <span className="badge badge-primary mr-2">
                              {personil.find((user) => user.personil_id === id)?.personil_name}
                            </span>
                            <button
                              type="button"
                              className="btn btn-xs btn-error"
                              onClick={() => setDarciRoles({
                                ...darciRoles,
                                [role]: darciRoles[role].filter((personilId) => personilId !== id)
                              })}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Generating PRD...' : 'Generate PRD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDForm;