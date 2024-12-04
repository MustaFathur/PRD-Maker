import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PRDForm = ({ initialData, setUpdatedPRD }) => {
  const [documentVersion, setDocumentVersion] = useState("");
  const [productName, setProductName] = useState("");
  const [documentOwner, setDocumentOwner] = useState("");
  const [developer, setDeveloper] = useState("");
  const [stakeholder, setStakeholder] = useState("");
  const [projectOverview, setProjectOverview] = useState("");
  const [darciRoles, setDarciRoles] = useState({
    decider: "",
    accountable: "",
    responsible: "",
    consulted: "",
    informed: "",
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Use navigate hook to redirect
  const prdId = initialData?.prdId || Date.now(); // Generate PRD ID if not provided

  useEffect(() => {
    if (initialData) {
      setDocumentVersion(initialData.documentVersion || "");
      setProductName(initialData.productName || "");
      setDocumentOwner(initialData.documentOwner || "");
      setDeveloper(initialData.developer || "");
      setStakeholder(initialData.stakeholder || "");
      setProjectOverview(initialData.projectOverview || "");
      setDarciRoles(initialData.darciRoles || {});
      setStartDate(initialData.startDate || "");
      setEndDate(initialData.endDate || "");
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const prdData = {
      prdId, // Include the PRD ID
      documentVersion,
      productName,
      documentOwner,
      developer,
      stakeholder,
      projectOverview,
      darciRoles,
      startDate,
      endDate,
    };

    try {
      // Save the PRD data to local storage or an API
      let prdHistory = JSON.parse(localStorage.getItem("prdHistory")) || [];
      const existingIndex = prdHistory.findIndex((prd) => prd.prdId === prdId);
      if (existingIndex !== -1) {
        // Update existing PRD data
        prdHistory[existingIndex] = prdData;
      } else {
        // Add new PRD
        prdHistory.push(prdData);
      }
      localStorage.setItem("prdHistory", JSON.stringify(prdHistory)); // Save to local storage

      // Update context or parent state
      setUpdatedPRD(prdData);

      // Navigate back to the dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to submit PRD");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Product Requirements Document
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* PRD Identity */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-lg font-semibold">PRD Identity</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {[
                {
                  label: "Document Version",
                  value: documentVersion,
                  onChange: setDocumentVersion,
                },
                {
                  label: "Product Name",
                  value: productName,
                  onChange: setProductName,
                },
              ].map(({ label, value, onChange }, idx) => (
                <div className="relative" key={idx}>
                  <input
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 peer"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                  />
                  <label className="absolute left-3 top-1/2 text-sm text-gray-500 bg-white px-1 transition-all transform -translate-y-1/2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-blue-500">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          {/* DARCI Roles */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-lg font-semibold">DARCI Roles</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {[
                "Decider",
                "Accountable",
                "Responsible",
                "Consulted",
                "Informed",
              ].map((role) => (
                <div key={role}>
                  <label
                    htmlFor={role.toLowerCase()}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {role}
                  </label>
                  <select
                    id={role.toLowerCase()}
                    className="w-full p-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring focus:ring-blue-300"
                    value={darciRoles[role.toLowerCase()]}
                    onChange={(e) =>
                      setDarciRoles({
                        ...darciRoles,
                        [role.toLowerCase()]: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select {role}
                    </option>
                    <option value="Person 1">Person 1</option>
                    <option value="Person 2">Person 2</option>
                  </select>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Project Dates */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-lg font-semibold">Project Dates</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {[
                {
                  label: "Start Date",
                  id: "start-date",
                  value: startDate,
                  onChange: setStartDate,
                },
                {
                  label: "End Date",
                  id: "end-date",
                  value: endDate,
                  onChange: setEndDate,
                },
              ].map(({ label, id, value, onChange }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {label}
                  </label>
                  <input
                    type="date"
                    id={id}
                    className="w-full p-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring focus:ring-blue-300"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          </fieldset>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition-colors"
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit PRD"}
          </button>

          {/* Error */}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default PRDForm;
