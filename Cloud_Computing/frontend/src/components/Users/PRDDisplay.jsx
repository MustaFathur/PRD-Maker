import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import Navbar from '../Layout/Navbar';
import api from '../../utils/api';

const PRDDisplay = ({ prdData }) => {
  if (!prdData) return null;

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
              Product Requirements Document
            </h1>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">PRD Identity</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <tbody>
                    <tr>
                      <td className="font-bold">Document Version</td>
                      <td>{prdData.document_version}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Product Name</td>
                      <td>{prdData.product_name}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Created Date</td>
                      <td>{new Date(prdData.created_date).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Document Owner</td>
                      <td>{prdData.document_owner.join(', ')}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Developer</td>
                      <td>{prdData.developer.join(', ')}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Stakeholder</td>
                      <td>{prdData.stakeholder.join(', ')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Project Overview</h2>
              <div className="text-sm">{prdData.project_overview}</div>
            </div>

            {/* Problem Statements */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Problem Statements</h2>
              <div className="overflow-x-auto">
                <ul className="text-sm list-disc list-inside">
                  {prdData.problemStatements.map((statement, index) => (
                    <li key={index}>{statement.content}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Objectives */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Objectives</h2>
              <div className="overflow-x-auto">
                <ul className="text-sm list-disc list-inside">
                  {prdData.objectives.map((objective, index) => (
                    <li key={index}>{objective.content}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">DARCI Roles</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Personil</th>
                      <th>Guidelines</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prdData.darciRoles.map((role, index) => (
                      <tr key={index}>
                        <td>{role.role}</td>
                        <td>{role.personil_name || 'N/A'}</td>
                        <td>{role.guidelines}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Project Timeline</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <thead>
                    <tr>
                      <th>Time Period</th>
                      <th>Activity</th>
                      <th>PIC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prdData.timelines.map((timeline, index) => (
                      <tr key={index}>
                        <td>{timeline.time_period}</td>
                        <td>{timeline.activity}</td>
                        <td>{timeline.pic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Success Metrics</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Definition</th>
                      <th>Current</th>
                      <th>Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prdData.successMetrics.map((metric, index) => (
                      <tr key={index}>
                        <td>{metric.name}</td>
                        <td>{metric.definition}</td>
                        <td>{metric.current}</td>
                        <td>{metric.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">User Stories</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>User Story</th>
                      <th>Acceptance Criteria</th>
                      <th>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prdData.userStories.map((story, index) => (
                      <tr key={index}>
                        <td>{story.title}</td>
                        <td>{story.user_story}</td>
                        <td>{story.acceptance_criteria}</td>
                        <td>{story.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to={`/prd/${prdData.prd_id}/edit`} className="btn btn-active">Edit PRD</Link>
              <button className="btn btn-neutral ml-2" onClick={handleDownload}>Download PRD</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDDisplay;