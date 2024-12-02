import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import Navbar from '../Layout/Navbar';

const PRDDetail = () => {
  const { id } = useParams();
  const [prdData, setPrdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPRD = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/prd/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch PRD data');
        }

        const data = await response.json();
        console.log("Fetched PRD Data:", data); // Debugging log
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!prdData) {
    return <div>No PRD data found</div>;
  }

  console.log("PRD Data Structure:", prdData); // Detailed debugging log

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">PRD Details</h1>
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold">Document Version</h2>
                <p>{prdData.document_version}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Product Name</h2>
                <p>{prdData.product_name}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Document Owner</h2>
                <p>{prdData.document_owner ? prdData.document_owner.personil_name : 'No Document Owner'}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Developer</h2>
                <p>{prdData.developer ? prdData.developer.personil_name : 'No Developer'}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Stakeholder</h2>
                <p>{prdData.stakeholder ? prdData.stakeholder.personil_name : 'No Stakeholder'}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Overview</h2>
                <p>{prdData.overview}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Context</h2>
                <p>{prdData.context}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">DARCI Roles</h2>
                {prdData.decider && (
                  <div>
                    <h3 className="text-lg font-medium">Decider</h3>
                    <p>{prdData.decider.personil_name}</p>
                  </div>
                )}
                {prdData.accountable && (
                  <div>
                    <h3 className="text-lg font-medium">Accountable</h3>
                    <p>{prdData.accountable.personil_name}</p>
                  </div>
                )}
                {prdData.responsible && (
                  <div>
                    <h3 className="text-lg font-medium">Responsible</h3>
                    <p>{prdData.responsible.personil_name}</p>
                  </div>
                )}
                {prdData.consulted && (
                  <div>
                    <h3 className="text-lg font-medium">Consulted</h3>
                    <p>{prdData.consulted.personil_name}</p>
                  </div>
                )}
                {prdData.informed && (
                  <div>
                    <h3 className="text-lg font-medium">Informed</h3>
                    <p>{prdData.informed.personil_name}</p>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">Project Timeline</h2>
                <p>Start Date: {prdData.start_date}</p>
                <p>End Date: {prdData.end_date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDDetail;