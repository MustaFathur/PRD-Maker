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
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">PRD Identity</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs border border-2">
                  <tbody>
                    <tr>
                      <td className="font-bold border border-2">Document Version</td>
                      <td className="border border-2">{prdData.document_version}</td>
                    </tr>
                    <tr>
                      <td className="font-bold border border-2">Product Name</td>
                      <td className="border border-2">{prdData.product_name}</td>
                    </tr>
                    <tr>
                      <td className="font-bold border border-2">Created Date</td>
                      <td className="border border-2">{new Date(prdData.created_date).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td className="font-bold border border-2">Document Owner</td>
                      <td className="border border-2">{prdData.document_owner.join(', ')}</td>
                    </tr>
                    <tr>
                      <td className="font-bold border border-2">Developer</td>
                      <td className="border border-2">{prdData.developer.join(', ')}</td>
                    </tr>
                    <tr>
                      <td className="font-bold border border-2">Stakeholder</td>
                      <td className="border border-2">{prdData.stakeholder.join(', ')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Project Overview</h2>
              <div className="text-sm p-4 border border-2 rounded-lg">{prdData.project_overview}</div>
            </div>

            {/* Problem Statements */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Problem Statements</h2>
              <div className="text-sm p-4 border border-2 rounded-lg">
                {prdData.problemStatements.map((statement, index) => (
                  <p key={index} className="mb-2">{statement.content}</p>
                ))}
              </div>
            </div>

            {/* Objectives */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Objectives</h2>
              <div className="text-sm p-4 border border-2 rounded-lg">
                {prdData.objectives.map((objective, index) => (
                  <p key={index} className="mb-2">{objective.content}</p>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">DARCI Roles</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs border border-2">
                  <thead>
                    <tr>
                      <th className="border border-2">Role</th>
                      <th className="border border-2">Personnel</th>
                      <th className="border border-2">Guidelines</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prdData.darciRoles.map((role, index) => (
                      <tr key={index}>
                        <td className="border border-2">{role.role}</td>
                        <td className="border border-2">{role.personil_name || 'N/A'}</td>
                        <td className="border border-2">{role.guidelines}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Project Timeline</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs border border-2">
                  <thead>
                    <tr>
                      <th className="border border-2">Time Period</th>
                      <th className="border border-2">Activity</th>
                      <th className="border border-2">PIC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prdData.timelines.map((timeline, index) => (
                      <tr key={index}>
                        <td className="border border-2">{timeline.time_period}</td>
                        <td className="border border-2">{timeline.activity}</td>
                        <td className="border border-2">{timeline.pic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Success Metrics</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs border border-2">
                  <thead>
                    <tr>
                      <th className="border border-2">Name</th>
                      <th className="border border-2">Definition</th>
                      <th className="border border-2">Current</th>
                      <th className="border border-2">Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prdData.successMetrics.map((metric, index) => (
                      <tr key={index}>
                        <td className="border border-2">{metric.name}</td>
                        <td className="border border-2">{metric.definition}</td>
                        <td className="border border-2">{metric.current}</td>
                        <td className="border border-2">{metric.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          <div className="mb-4">
  <h2 className="text-2xl font-bold mb-2">User Stories</h2>
  <div className="overflow-x-auto">
    <table className="table table-xs border border-2">
      <thead>
        <tr>
          <th className="border border-2">Title</th>
          <th className="border border-2">User Story</th>
          <th className="border border-2">Acceptance Criteria</th>
          <th className="border border-2">Priority</th>
        </tr>
      </thead>
      <tbody>
        {prdData.userStories.map((story, index) => (
          <tr key={index}>
            <td className="border border-2">{story.title}</td>
            <td className="border border-2">{story.user_story}</td>
            <td className="border border-2">{story.acceptance_criteria}</td>
            <td className="border border-2">{story.priority}</td> {/* Fixed closing tag */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">UI/UX</h2>
            <div className="overflow-x-auto">
              <ul className="text-sm list-disc list-inside">
                {prdData.uiUx.map((uiux, index) => (
                  <li key={index}>
                    <a href={uiux.link} target="_blank" rel="noopener noreferrer">
                      {uiux.link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">References</h2>
            <div className="overflow-x-auto">
              <ul className="text-sm list-disc list-inside">
                {prdData.references.map((reference, index) => (
                  <li key={index}>
                    <a href={reference.link} target="_blank" rel="noopener noreferrer">
                      {reference.link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end">
            <Link to={`/prd/${prdData.prd_id}/edit`} className="btn btn-active">
              Edit PRD
            </Link>
            <button
              className="btn btn-neutral ml-2"
              onClick={() => handleDownload(prdData.prd_id)}
            >
              Download PRD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDDisplay;
