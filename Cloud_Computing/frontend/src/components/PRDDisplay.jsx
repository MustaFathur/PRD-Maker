import React from 'react';

const PRDDisplay = ({ prdData }) => {
  if (!prdData) return null;

  // Access the nested prd object
  const prd = prdData.prd;

  console.log("PRD Data:", prd);

  const renderMarkdown = (text) => {
    return text?.split('\n').map((line, index) => {
      if (line.startsWith('##')) {
        return <h2 key={index} className="text-2xl font-bold mt-4 mb-2">{line.replace('##', '').trim()}</h2>;
      } else if (line.startsWith('###')) {
        return <h3 key={index} className="text-xl font-semibold mt-3 mb-2">{line.replace('###', '').trim()}</h3>;
      } else if (line.startsWith('-')) {
        return <li key={index} className="ml-4">{line.replace('-', '').trim()}</li>;
      }
      return <p key={index} className="mb-2">{line}</p>;
    });
  };

  const renderDARCIRole = (roleData, roleName) => {
    if (!roleData) return null;

    return (
      <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
        <h4 className="text-lg font-semibold mb-2 flex items-center">
          {roleName.charAt(0).toUpperCase() + roleName.slice(1)}
        </h4>
        <div className="ml-7">
          <div className="mb-2">
            <span className="font-medium">Assigned to: </span>
            {roleData.persons?.map((person, idx) => (
              <span key={idx} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                {person}
              </span>
            ))}
          </div>
          <div className="text-gray-700">
            {renderMarkdown(roleData.explanation)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-xl shadow-lg">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {prd.prd_identity?.product_name} - PRD
        </h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Document Version</p>
            <p className="font-semibold">{prd.prd_identity?.document_version}</p>
          </div>
          <div>
            <p className="text-gray-600">Document Stage</p>
            <p className="font-semibold">{prd.prd_identity?.document_stage}</p>
          </div>
          <div>
            <p className="text-gray-600">Document Owner</p>
            <p className="font-semibold">{prd.prd_identity?.document_owner}</p>
          </div>
          <div>
            <p className="text-gray-600">Developer</p>
            <p className="font-semibold">{prd.prd_identity?.developer}</p>
          </div>
          <div>
            <p className="text-gray-600">Stakeholder</p>
            <p className="font-semibold">{prd.prd_identity?.stakeholder}</p>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <div className="prose max-w-none">
          {renderMarkdown(prd.overview)}
        </div>
      </div>

      {/* DARCI Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">DARCI Framework</h2>
        {Object.entries(prd.darci || {}).map(([role, data]) => 
          renderDARCIRole(data, role)
        )}
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Project Timeline</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Start Date</p>
            <p className="font-semibold">{new Date(prd.project_timeline?.start_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">End Date</p>
            <p className="font-semibold">{new Date(prd.project_timeline?.end_date).toLocaleDateString()}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600">Project Manager</p>
            <p className="font-semibold">{prd.project_timeline?.pic}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDDisplay;