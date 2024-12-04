import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddPrd from "./components/AddPrd";
import { MoreVertical, Edit2, Trash2, Download, Notebook } from "lucide-react";

function DashboardPage() {
  const [prdList, setPrdList] = useState([]);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open

  // Handle adding a new PRD
  const handleAddPrd = (prdName, prdId) => {
    setPrdList([...prdList, { id: prdId, name: prdName }]);
  };

  // Handle deleting a PRD
  const handleDeletePrd = (prdId) => {
    setPrdList(prdList.filter((prd) => prd.id !== prdId));
  };

  // Handle downloading a PRD
  const handleDownloadPrd = (prdId) => {
    const prd = prdList.find((item) => item.id === prdId);
    if (prd) {
      const fileContent = `PRD Name: ${prd.name}\nPRD ID: ${prd.id}`;
      const blob = new Blob([fileContent], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${prd.name}_PRD.txt`;
      link.click();
    }
  };

  // Toggle dropdown
  const toggleDropdown = (prdId) => {
    setOpenDropdown(openDropdown === prdId ? null : prdId);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-gray-800">AI PRD Maker</h1>
        <p className="text-gray-600 mt-2">
          Effortlessly create, edit, manage, and download your PRDs – all in one
          place
        </p>

        {/* PRD Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {/* Add PRD Component */}
          <AddPrd onAddPrd={handleAddPrd} />

          {/* List of PRDs */}
          {prdList.map((prd) => (
            <div
              key={prd.id}
              className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Notebook className="h-12 w-12 text-blue-500 mr-4" />
                  <h2 className="text-xl font-semibold text-gray-700">
                    {prd.name}
                  </h2>
                </div>

                {/* Dropdown Button */}
                <button
                  onClick={() => toggleDropdown(prd.id)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <p className="text-gray-500 text-sm mt-2">ID: {prd.id}</p>

              {/* Dropdown Menu */}
              {openDropdown === prd.id && (
                <div className="absolute top-12 right-4 bg-white border border-gray-200 shadow-md rounded-lg w-40 z-10">
                  <button
                    onClick={() => navigate(`/dashboard/prd/${prd.id}/edit`)}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDownloadPrd(prd.id)}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDeletePrd(prd.id)}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
