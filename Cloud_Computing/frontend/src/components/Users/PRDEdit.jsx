import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import Navbar from '../Layout/Navbar';
import api from '../../utils/api';

const PRDEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prdData, setPrdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPRD = async () => {
      try {
        console.log(`Fetching PRD with ID: ${id}`);
        const response = await api.get(`/prd/${id}`);
        const data = response.data;
        console.log('Fetched PRD data:', data);
        // Initialize arrays if not present
        data.darciRoles = data.darciRoles || [];
        data.timelines = data.timelines || [];
        data.successMetrics = data.successMetrics || [];
        data.userStories = data.userStories || [];
        data.problemStatements = data.problemStatements || [];
        data.objectives = data.objectives || [];
        data.ui_ux = data.uiUx || [];
        data.references = data.references || [];
        data.prd_personil = {
          document_owner: data.document_owner || [],
          stakeholder: data.stakeholder || [],
          developer: data.developer || []
        };
        console.log('Processed PRD data:', data);
        setPrdData(data);
      } catch (error) {
        console.error('Error fetching PRD data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPRD();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrdData({ ...prdData, [name]: value });
  };

  const handleArrayChange = (e, index, arrayName, field) => {
    const { value } = e.target;
    const newArray = [...prdData[arrayName]];
    newArray[index][field] = value;
    setPrdData({ ...prdData, [arrayName]: newArray });
  };
  
  const handleAddArrayItem = (arrayName, field) => {
    setPrdData({ ...prdData, [arrayName]: [...prdData[arrayName], { [field]: '' }] });
  };
  
  const handleRemoveArrayItem = (index, arrayName) => {
    const newArray = prdData[arrayName].filter((_, i) => i !== index);
    setPrdData({ ...prdData, [arrayName]: newArray });
  };

  const handleAddDarciRole = (role) => {
    setPrdData({
      ...prdData,
      darciRoles: [
        ...prdData.darciRoles,
        { role, personil_name: '', guidelines: '' }
      ]
    });
  };

  const handleDarciRoleChange = (index, field, value) => {
    const newRoles = [...prdData.darciRoles];
    newRoles[index][field] = value;
    setPrdData({
      ...prdData,
      darciRoles: newRoles
    });
  };

  const handleRemoveDarciRole = (index) => {
    const newRoles = prdData.darciRoles.filter((_, i) => i !== index);
    setPrdData({
      ...prdData,
      darciRoles: newRoles
    });
  };

  const handlePersonilChange = (e, index, field) => {
    const { value } = e.target;
    const newPersonil = [...prdData.prd_personil[field]];
    newPersonil[index] = value;
    setPrdData({
      ...prdData,
      prd_personil: {
        ...prdData.prd_personil,
        [field]: newPersonil,
      },
    });
  };
  
  const handleAddPersonil = (field) => {
    setPrdData({
      ...prdData,
      prd_personil: {
        ...prdData.prd_personil,
        [field]: [...prdData.prd_personil[field], '']
      },
    });
  };
  
  const handleRemovePersonil = (index, field) => {
    const newPersonil = prdData.prd_personil[field].filter((_, i) => i !== index);
    setPrdData({
      ...prdData,
      prd_personil: {
        ...prdData.prd_personil,
        [field]: newPersonil,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedData = {
        ...prdData,
        document_owner: prdData.prd_personil.document_owner,
        stakeholder: prdData.prd_personil.stakeholder,
        developer: prdData.prd_personil.developer,
        darci_roles: prdData.darciRoles,
        problem_statements: prdData.problemStatements,
        objectives: prdData.objectives,
        timelines: prdData.timelines,
        success_metrics: prdData.successMetrics,
        user_stories: prdData.userStories,
        ui_ux: prdData.ui_ux,
        references: prdData.references,
      };
      await api.put(`/prd/${id}`, updatedData);
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
            <Link to="/prd-list" className="text-xl absolute top-4 left-4 btn btn-ghost">
                  ← 
            </Link>
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
                <label className="block text-gray-700">Document Owner</label>
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th>Document Owner</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prdData.prd_personil.document_owner.map((owner, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              className="input input-bordered w-full"
                              value={owner}
                              onChange={(e) => handlePersonilChange(e, index, 'document_owner')}
                              required
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-xs"
                              onClick={() => handleRemovePersonil(index, 'document_owner')}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="btn btn-active mt-2"
                  onClick={() => handleAddPersonil('document_owner')}
                >
                  Add Document Owner
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Stakeholder</label>
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th>Stakeholder</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prdData.prd_personil.stakeholder.map((stakeholder, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              className="input input-bordered w-full"
                              value={stakeholder}
                              onChange={(e) => handlePersonilChange(e, index, 'stakeholder')}
                              required
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-xs"
                              onClick={() => handleRemovePersonil(index, 'stakeholder')}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="btn btn-active mt-2"
                  onClick={() => handleAddPersonil('stakeholder')}
                >
                  Add Stakeholder
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Developer</label>
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th>Developer</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prdData.prd_personil.developer.map((developer, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              className="input input-bordered w-full"
                              value={developer}
                              onChange={(e) => handlePersonilChange(e, index, 'developer')}
                              required
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-xs"
                              onClick={() => handleRemovePersonil(index, 'developer')}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="btn btn-active mt-2"
                  onClick={() => handleAddPersonil('developer')}
                >
                  Add Developer
                </button>
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
                  value={prdData.start_date.split('T')[0]}
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
                  value={prdData.end_date.split('T')[0]}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
                <legend className="text-lg font-semibold">Problem Statements</legend>
                {prdData.problemStatements.map((statement, index) => (
                  <div key={index} className="mb-4">
                    <textarea
                      name={`problem_statement_${index}`}
                      className="textarea textarea-bordered w-full"
                      value={statement.content}
                      onChange={(e) => handleArrayChange(e, index, 'problemStatements', 'content')}
                      required
                    ></textarea>
                    <button
                      type="button"
                      className="btn btn-xs mt-2"
                      onClick={() => handleRemoveArrayItem(index, 'problemStatements')}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-active mt-2"
                  onClick={() => handleAddArrayItem('problemStatements', 'content')}
                >
                  Add Problem Statement
                </button>
              </fieldset>
              <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
                <legend className="text-lg font-semibold">Objectives</legend>
                {prdData.objectives.map((objective, index) => (
                  <div key={index} className="mb-4">
                    <textarea
                      name={`objective_${index}`}
                      className="textarea textarea-bordered w-full"
                      value={objective.content}
                      onChange={(e) => handleArrayChange(e, index, 'objectives', 'content')}
                      required
                    ></textarea>
                    <button
                      type="button"
                      className="btn btn-xs mt-2"
                      onClick={() => handleRemoveArrayItem(index, 'objectives')}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-active mt-2"
                  onClick={() => handleAddArrayItem('objectives', 'content')}
                >
                  Add Objective
                </button>
              </fieldset>
              <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
                <legend className="text-lg font-semibold">DARCI Roles</legend>
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th>Role</th>
                        <th>Personil Name</th>
                        <th>Guidelines</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prdData.darciRoles.map((darci, index) => (
                        <tr key={index}>
                          <td>{darci.role}</td>
                          <td>
                            <input
                              type="text"
                              className="input input-bordered w-full"
                              value={darci.personil_name}
                              onChange={(e) => handleDarciRoleChange(index, 'personil_name', e.target.value)}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="input input-bordered w-full"
                              value={darci.guidelines}
                              onChange={(e) => handleDarciRoleChange(index, 'guidelines', e.target.value)}
                              required
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-xs"
                              onClick={() => handleRemoveDarciRole(index)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2">
                  {['decider', 'accountable', 'responsible', 'consulted', 'informed'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      className="btn btn-active mr-2"
                      onClick={() => handleAddDarciRole(role)}
                    >
                      Add {role}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
                <legend className="text-lg font-semibold">Project Timeline</legend>
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th>Time Period</th>
                        <th>Activity</th>
                        <th>PIC</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prdData.timelines.map((timeline, index) => (
                        <tr key={index}>
                          <td>
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
                          </td>
                          <td>
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
                          </td>
                          <td>
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
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-xs"
                              onClick={() => {
                                const newTimelines = prdData.timelines.filter((_, i) => i !== index);
                                setPrdData({ ...prdData, timelines: newTimelines });
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="btn btn-active mt-2"
                  onClick={() => setPrdData({ ...prdData, timelines: [...prdData.timelines, { time_period: '', activity: '', pic: '' }] })}
                >
                  Add Timeline
                </button>
              </fieldset>
              <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
                <legend className="text-lg font-semibold">Success Metrics</legend>
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Definition</th>
                        <th>Current</th>
                        <th>Target</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prdData.successMetrics.map((metric, index) => (
                        <tr key={index}>
                          <td>
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
                          </td>
                          <td>
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
                          </td>
                          <td>
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
                          </td>
                          <td>
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
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-xs"
                              onClick={() => {
                                const newMetrics = prdData.successMetrics.filter((_, i) => i !== index);
                                setPrdData({ ...prdData, successMetrics: newMetrics });
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="btn btn-active mt-2"
                  onClick={() => setPrdData({ ...prdData, successMetrics: [...prdData.successMetrics, { name: '', definition: '', current: '', target: '' }] })}
                >
                  Add Metric
                </button>
              </fieldset>
              <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
                <legend className="text-lg font-semibold">User Stories</legend>
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>User Story</th>
                        <th>Acceptance Criteria</th>
                        <th>Priority</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prdData.userStories.map((story, index) => (
                        <tr key={index}>
                          <td>
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
                          </td>
                          <td>
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
                          </td>
                          <td>
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
                          </td>
                          <td>
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
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-xs"
                              onClick={() => {
                                const newStories = prdData.userStories.filter((_, i) => i !== index);
                                setPrdData({ ...prdData, userStories: newStories });
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="btn btn-active mt-2"
                  onClick={() => setPrdData({ ...prdData, userStories: [...prdData.userStories, { title: '', user_story: '', acceptance_criteria: '', priority: '' }] })}
                >
                  Add User Story
                </button>
              </fieldset>
              <div className="mb-4">
                <label className="block text-gray-700">UI/UX</label>
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th>Link</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prdData.ui_ux.map((uiux, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              className="input input-bordered w-full"
                              value={uiux.link}
                              onChange={(e) => handleArrayChange(e, index, 'ui_ux', 'link')}
                              required
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-xs"
                              onClick={() => handleRemoveArrayItem(index, 'ui_ux')}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="btn btn-active mt-2"
                  onClick={() => handleAddArrayItem('ui_ux', 'link')}
                >
                  Add UI/UX
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">References</label>
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th>Link</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prdData.references.map((reference, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              className="input input-bordered w-full"
                              value={reference.link}
                              onChange={(e) => handleArrayChange(e, index, 'references', 'link')}
                              required
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-xs"
                              onClick={() => handleRemoveArrayItem(index, 'references')}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="btn btn-active mt-2"
                  onClick={() => handleAddArrayItem('references', 'link')}
                >
                  Add Reference
                </button>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-neutral" disabled={loading}>
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