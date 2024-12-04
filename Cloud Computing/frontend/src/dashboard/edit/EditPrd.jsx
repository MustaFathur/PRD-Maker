import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PRDForm from "../../components/PRDForm";
import { PRDInfoContext } from "@/context/PRDInfocontext";

function EditPRD() {
  const { prdId } = useParams();
  const [PRDInfo, setPRDInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://your-api-endpoint.com/prds/${prdId}` // Replace with your actual API endpoint
        );
        const fetchedPRDInfo = await response.json();
        setPRDInfo(fetchedPRDInfo);
        setFormData(fetchedPRDInfo || {});
      } catch (error) {
        console.error("Error fetching PRD data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (prdId) {
      fetchData();
    } else {
      console.error("Invalid prdId parameter");
    }
  }, [prdId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDarciChange = (role, value) => {
    setFormData((prevData) => ({
      ...prevData,
      darciRoles: {
        ...prevData.darciRoles,
        [role]: value,
      },
    }));
  };

  return (
    <PRDInfoContext.Provider value={{ PRDInfo, setPRDInfo }}>
      <div className="p-10">
        <div className="bg-white shadow-md p-6 rounded-md">
          {isLoading ? (
            <div className="text-center">Loading PRD...</div>
          ) : (
            <>
              {/* Back to Dashboard */}
              <div className="mb-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-white text-black border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  Back to Dashboard
                </button>
              </div>

              {/* PRD Form */}
              <PRDForm
                initialData={formData}
                onInputChange={handleInputChange}
                onDarciChange={handleDarciChange}
              />

              {/* Navigate to PRD Preview */}
              <div className="mt-4">
                <button
                  onClick={() =>
                    navigate(`/dashboard/prd/preview`, {
                      state: { PRDInfo: formData },
                    })
                  }
                  className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Preview PRD
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </PRDInfoContext.Provider>
  );
}

export default EditPRD;
