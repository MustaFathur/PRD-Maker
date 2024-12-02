import React, { useEffect, useState } from 'react';
import Sidebar from '../Layout/Sidebar';
import Navbar from '../Layout/Navbar';

const PRDDisplay = ({ prdData }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (prdData) {
      try {
        // Ensure the data is properly parsed
        const parsedData = typeof prdData === 'string' 
          ? JSON.parse(prdData) 
          : prdData;

        // Validate the data structure
        if (!parsedData || !parsedData.prd_identity) {
          throw new Error('Invalid PRD data structure');
        }

        setData(parsedData);
        setLoading(false);
      } catch (err) {
        console.error('Error processing PRD data:', err);
        setError('Failed to parse PRD data');
        setLoading(false);
      }
    }
  }, [prdData]);

  const renderContent = (content) => {
    if (!content) return null;

    // Split content into sections based on headers
    const sections = content.split(/(?=\d+\.\s+[A-Z])/);
    
    return sections.map((section, index) => {
      if (!section.trim()) return null;
      
      // Extract section title if it exists
      const titleMatch = section.match(/^(\d+\.\s+[^\n]+)/);
      const title = titleMatch ? titleMatch[1] : '';
      const content = titleMatch ? section.slice(title.length) : section;
      
      return (
        <div key={index} className="mb-6">
          {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
          <div className="prose max-w-none">
            {content.split('\n').map((paragraph, pIndex) => (
              <p key={pIndex} className="mb-2">{paragraph.trim()}</p>
            ))}
          </div>
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50">
        <div className="text-2xl font-semibold text-red-600">
          {error || 'No PRD data available'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Product Requirements Document
            </h1>

            {/* PRD Identity Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                PRD Identity
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-medium text-gray-700">Document Version</h3>
                  <p className="text-gray-900">{data.prd_identity?.document_version || 'Not specified'}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-medium text-gray-700">Product Name</h3>
                  <p className="text-gray-900">{data.prd_identity?.product_name || 'Not specified'}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-medium text-gray-700">Document Owner</h3>
                  <p className="text-gray-900">{data.prd_identity?.document_owner || 'Not specified'}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-medium text-gray-700">Developer</h3>
                  <p className="text-gray-900">{data.prd_identity?.developer || 'Not specified'}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-medium text-gray-700">Stakeholder</h3>
                  <p className="text-gray-900">{data.prd_identity?.stakeholder || 'Not specified'}</p>
                </div>
              </div>
            </section>

            {/* Project Overview Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                Project Overview
              </h2>
              <p className="text-gray-900">{data.project_overview || 'Not specified'}</p>
            </section>

            {/* DARCI Roles Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                DARCI Roles
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.darciRoles?.decider && (
                  <div className="bg-gray-100 p-4 rounded">
                    <h3 className="font-medium text-gray-700">Decider</h3>
                    <p className="text-gray-900">{data.darciRoles.decider.join(', ') || 'Not specified'}</p>
                  </div>
                )}
                {data.darciRoles?.accountable && (
                  <div className="bg-gray-100 p-4 rounded">
                    <h3 className="font-medium text-gray-700">Accountable</h3>
                    <p className="text-gray-900">{data.darciRoles.accountable.join(', ') || 'Not specified'}</p>
                  </div>
                )}
                {data.darciRoles?.responsible && (
                  <div className="bg-gray-100 p-4 rounded">
                    <h3 className="font-medium text-gray-700">Responsible</h3>
                    <p className="text-gray-900">{data.darciRoles.responsible.join(', ') || 'Not specified'}</p>
                  </div>
                )}
                {data.darciRoles?.consulted && (
                  <div className="bg-gray-100 p-4 rounded">
                    <h3 className="font-medium text-gray-700">Consulted</h3>
                    <p className="text-gray-900">{data.darciRoles.consulted.join(', ') || 'Not specified'}</p>
                  </div>
                )}
                {data.darciRoles?.informed && (
                  <div className="bg-gray-100 p-4 rounded">
                    <h3 className="font-medium text-gray-700">Informed</h3>
                    <p className="text-gray-900">{data.darciRoles.informed.join(', ') || 'Not specified'}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Project Timeline Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                Project Timeline
              </h2>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Activity</th>
                    <th className="py-2 px-4 border-b">Start Date</th>
                    <th className="py-2 px-4 border-b">End Date</th>
                    <th className="py-2 px-4 border-b">PIC</th>
                  </tr>
                </thead>
                <tbody>
                  {data.project_timeline?.milestones.map((milestone, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{milestone.activity}</td>
                      <td className="py-2 px-4 border-b">{milestone.start_date}</td>
                      <td className="py-2 px-4 border-b">{milestone.end_date}</td>
                      <td className="py-2 px-4 border-b">{milestone.pic.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Success Metrics Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                Success Metrics
              </h2>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Metric Name</th>
                    <th className="py-2 px-4 border-b">Definition</th>
                    <th className="py-2 px-4 border-b">Actual Value</th>
                    <th className="py-2 px-4 border-b">Target Value</th>
                  </tr>
                </thead>
                <tbody>
                  {data.success_metrics?.map((metric, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{metric.metric_name}</td>
                      <td className="py-2 px-4 border-b">{metric.definition}</td>
                      <td className="py-2 px-4 border-b">{metric.actual_value}</td>
                      <td className="py-2 px-4 border-b">{metric.target_value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* User Stories Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                User Stories
              </h2>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Title</th>
                    <th className="py-2 px-4 border-b">User Story</th>
                    <th className="py-2 px-4 border-b">Acceptance Criteria</th>
                    <th className="py-2 px-4 border-b">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {data.user_stories?.map((story, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{story.title}</td>
                      <td className="py-2 px-4 border-b">{story.user_story}</td>
                      <td className="py-2 px-4 border-b">{story.acceptance_criteria}</td>
                      <td className="py-2 px-4 border-b">{story.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* UI/UX Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                UI/UX
              </h2>
              <p className="text-gray-900">{data.ui_ux?.link || 'Not specified'}</p>
            </section>

            {/* References Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                References
              </h2>
              <ul className="list-disc list-inside">
                {data.references?.map((reference, index) => (
                  <li key={index} className="text-gray-900">{reference.reference_link}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDDisplay;