import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import Navbar from '../Layout/Navbar';
import api from '../../utils/api';

const PRDEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prdData, setPrdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [personil, setPersonil] = useState([]);

  useEffect(() => {
    const fetchPRD = async () => {
      try {
        const response = await api.get(`/prd/${id}`);
        const data = response.data;
        // Inisialisasi darciRoles, timelines, successMetrics, dan userStories jika tidak ada
        data.darciRoles = data.darciRoles || {
          decider: [],
          accountable: [],
          responsible: [],
          consulted: [],
          informed: []
        };
        data.timelines = data.timelines || [];
        data.successMetrics = data.successMetrics || [];
        data.userStories = data.userStories || [];
        data.selectedPersonil = {
          decider: '',
          accountable: '',
          responsible: '',
          consulted: '',
          informed: ''
        };
        setPrdData(data);
      } catch (error) {
        console.error('Error fetching PRD data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPersonil = async () => {
      try {
        const response = await api.get('/personil');
        setPersonil(response.data);
      } catch (error) {
        console.error('Error fetching personil data:', error);
        setError(error.message);
      }
    };

    fetchPRD();
    fetchPersonil();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrdData({ ...prdData, [name]: value });
  };

  const handleAddPersonil = (role) => {
    if (prdData.selectedPersonil[role]) {
      setPrdData({
        ...prdData,
        darciRoles: {
          ...prdData.darciRoles,
          [role]: [...prdData.darciRoles[role], prdData.selectedPersonil[role]]
        },
        selectedPersonil: { ...prdData.selectedPersonil, [role]: '' }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/prd/${id}`, prdData);
      navigate(`/prd/${id}`);
    } catch (error) {
      console.error('Error updating PRD:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!prdData) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg relative">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Edit PRD
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Product Name</label>
                <input
                  type="text"
                  name="product_name"
                  className="input input-bordered w-full"
                  value={prdData.product_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Document Version</label>
                <input
                  type="text"
                  name="document_version"
                  className="input input-bordered w-full"
                  value={prdData.document_version}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Project Overview</label>
                <textarea
                  name="project_overview"
                  className="textarea textarea-bordered w-full"
                  value={prdData.project_overview}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  className="input input-bordered w-full"
                  value={prdData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  className="input input-bordered w-full"
                  value={prdData.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
                <legend className="text-lg font-semibold">DARCI Roles</legend>
                {['decider', 'accountable', 'responsible', 'consulted', 'informed'].map((role) => (
                  <div key={role} className="mb-4">
                    <label className="block text-gray-700 capitalize">{role}</label>
                    <div className="flex">
                      <select
                        className="input input-bordered w-full"
                        value={prdData.selectedPersonil[role]}
                        onChange={(e) => setPrdData({ ...prdData, selectedPersonil: { ...prdData.selectedPersonil, [role]: e.target.value } })}
                      >
                        <option value="">Select {role}</option>
                        {personil.filter(user => !prdData.darciRoles[role].includes(user.personil_id)).map((user) => (
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
                      {prdData.darciRoles[role].map((id) => (
                        <div key={id} className="flex items-center mr-2 mb-2">
                          <span className="badge badge-primary mr-2">
                            {personil.find((user) => user.personil_id === id)?.personil_name}
                          </span>
                          <button
                            type="button"
                            className="btn btn-xs btn-error"
                            onClick={() => setPrdData({
                              ...prdData,
                              darciRoles: {
                                ...prdData.darciRoles,
                                [role]: prdData.darciRoles[role].filter((personilId) => personilId !== id)
                              }
                            })}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </fieldset>
              <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
                <legend className="text-lg font-semibold">Project Timeline</legend>
                {prdData.timelines.map((timeline, index) => (
                  <div key={index} className="mb-4">
                    <label className="block text-gray-700">Time Period</label>
                    <input
                      type="text"
                      name={`time_period_${index}`}
                      className="input input-bordered w-full"
                      value={timeline.time_period}
                      onChange={(e) => {
                        const newTimelines = [...prdData.timelines];
                        newTimelines[index].time_period = e.target.value;
                        setPrdData({ ...prdData, timelines: newTimelines });
                      }}
                      required
                    />
                    <label className="block text-gray-700">Activity</label>
                    <input
                      type="text"
                      name={`activity_${index}`}
                      className="input input-bordered w-full"
                      value={timeline.activity}
                      onChange={(e) => {
                        const newTimelines = [...prdData.timelines];
                        newTimelines[index].activity = e.target.value;
                        setPrdData({ ...prdData, timelines: newTimelines });
                      }}
                      required
                    />
                    <label className="block text-gray-700">PIC</label>
                    <input
                      type="text"
                      name={`pic_${index}`}
                      className="input input-bordered w-full"
                      value={timeline.pic}
                      onChange={(e) => {
                        const newTimelines = [...prdData.timelines];
                        newTimelines[index].pic = e.target.value;
                        setPrdData({ ...prdData, timelines: newTimelines });
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-xs btn-error mt-2"
                      onClick={() => {
                        const newTimelines = prdData.timelines.filter((_, i) => i !== index);
                        setPrdData({ ...prdData, timelines: newTimelines });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPrdData({ ...prdData, timelines: [...prdData.timelines, { time_period: '', activity: '', pic: '' }] })}
                >
                  Add Timeline
                </button>
              </fieldset>
              <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
                <legend className="text-lg font-semibold">Success Metrics</legend>
                {prdData.successMetrics.map((metric, index) => (
                  <div key={index} className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                      type="text"
                      name={`name_${index}`}
                      className="input input-bordered w-full"
                      value={metric.name}
                      onChange={(e) => {
                        const newMetrics = [...prdData.successMetrics];
                        newMetrics[index].name = e.target.value;
                        setPrdData({ ...prdData, successMetrics: newMetrics });
                      }}
                      required
                    />
                    <label className="block text-gray-700">Definition</label>
                    <input
                      type="text"
                      name={`definition_${index}`}
                      className="input input-bordered w-full"
                      value={metric.definition}
                      onChange={(e) => {
                        const newMetrics = [...prdData.successMetrics];
                        newMetrics[index].definition = e.target.value;
                        setPrdData({ ...prdData, successMetrics: newMetrics });
                      }}
                      required
                    />
                    <label className="block text-gray-700">Current</label>
                    <input
                      type="text"
                      name={`current_${index}`}
                      className="input input-bordered w-full"
                      value={metric.current}
                      onChange={(e) => {
                        const newMetrics = [...prdData.successMetrics];
                        newMetrics[index].current = e.target.value;
                        setPrdData({ ...prdData, successMetrics: newMetrics });
                      }}
                      required
                    />
                    <label className="block text-gray-700">Target</label>
                    <input
                      type="text"
                      name={`target_${index}`}
                      className="input input-bordered w-full"
                      value={metric.target}
                      onChange={(e) => {
                        const newMetrics = [...prdData.successMetrics];
                        newMetrics[index].target = e.target.value;
                        setPrdData({ ...prdData, successMetrics: newMetrics });
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-xs btn-error mt-2"
                      onClick={() => {
                        const newMetrics = prdData.successMetrics.filter((_, i) => i !== index);
                        setPrdData({ ...prdData, successMetrics: newMetrics });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPrdData({ ...prdData, successMetrics: [...prdData.successMetrics, { name: '', definition: '', current: '', target: '' }] })}
                >
                  Add Metric
                </button>
              </fieldset>
              <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
                <legend className="text-lg font-semibold">User Stories</legend>
                {prdData.userStories.map((story, index) => (
                  <div key={index} className="mb-4">
                    <label className="block text-gray-700">Title</label>
                    <input
                      type="text"
                      name={`title_${index}`}
                      className="input input-bordered w-full"
                      value={story.title}
                      onChange={(e) => {
                        const newStories = [...prdData.userStories];
                        newStories[index].title = e.target.value;
                        setPrdData({ ...prdData, userStories: newStories });
                      }}
                      required
                    />
                    <label className="block text-gray-700">User Story</label>
                    <textarea
                      name={`user_story_${index}`}
                      className="textarea textarea-bordered w-full"
                      value={story.user_story}
                      onChange={(e) => {
                        const newStories = [...prdData.userStories];
                        newStories[index].user_story = e.target.value;
                        setPrdData({ ...prdData, userStories: newStories });
                      }}
                      required
                    ></textarea>
                    <label className="block text-gray-700">Acceptance Criteria</label>
                    <textarea
                      name={`acceptance_criteria_${index}`}
                      className="textarea textarea-bordered w-full"
                      value={story.acceptance_criteria}
                      onChange={(e) => {
                        const newStories = [...prdData.userStories];
                        newStories[index].acceptance_criteria = e.target.value;
                        setPrdData({ ...prdData, userStories: newStories });
                      }}
                      required
                    ></textarea>
                    <label className="block text-gray-700">Priority</label>
                    <input
                      type="text"
                      name={`priority_${index}`}
                      className="input input-bordered w-full"
                      value={story.priority}
                      onChange={(e) => {
                        const newStories = [...prdData.userStories];
                        newStories[index].priority = e.target.value;
                        setPrdData({ ...prdData, userStories: newStories });
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-xs btn-error mt-2"
                      onClick={() => {
                        const newStories = prdData.userStories.filter((_, i) => i !== index);
                        setPrdData({ ...prdData, userStories: newStories });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPrdData({ ...prdData, userStories: [...prdData.userStories, { title: '', user_story: '', acceptance_criteria: '', priority: '' }] })}
                >
                  Add User Story
                </button>
              </fieldset>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update PRD'}
                </button>
              </div>
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDEdit;