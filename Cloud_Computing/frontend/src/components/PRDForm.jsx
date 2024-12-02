    import React, { useState } from "react";
    import { motion } from "framer-motion";
    import PRDDisplay from "./PRDDisplay";

    const PRDForm = () => {
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
    const [generatedPRD, setGeneratedPRD] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const prdData = {
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
        const response = await fetch("http://localhost:5000/submit-prd", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(prdData),
        });

        if (!response.ok) {
            throw new Error("Failed to submit PRD");
        }

        const result = await response.json();
        setGeneratedPRD(result.prd);
        } catch (error) {
        setError(error.message);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
            className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6 text-gray-800 font-poppins"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-2xl font-bold text-center mb-6">
            Product Requirements Document
            </h1>

            <form className="space-y-6" onSubmit={handleSubmit}>
            {/* PRD Identity */}
            <fieldset className="border border-gray-300 rounded-lg p-4">
                <legend className="text-lg font-semibold">PRD Identity</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <label
                    className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 ${
                        documentVersion ? "transform -translate-y-4 scale-75" : ""
                    }`}
                    >
                    <i className="fas fa-file-alt mr-2"></i> Document Version
                    </label>
                    <motion.input
                    type="text"
                    placeholder=" "
                    className="input input-bordered w-full transition duration-300 ease-in-out focus:border-blue-500 focus:ring focus:ring-blue-200"
                    value={documentVersion}
                    onChange={(e) => setDocumentVersion(e.target.value)}
                    required
                    whileFocus={{ scale: 1.05 }}
                    />
                </div>

                <div className="relative">
                    <label
                    className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 ${
                        productName ? "transform -translate-y-4 scale-75" : ""
                    }`}
                    >
                    <i className="fas fa-box mr-2"></i> Product Name
                    </label>
                    <motion.input
                    type="text"
                    placeholder=" "
                    className="input input-bordered w-full transition duration-300 ease-in-out focus:border-blue-500 focus:ring focus:ring-blue-200"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    whileFocus={{ scale: 1.05 }}
                    />
                </div>

                <div className="relative">
                    <label
                    className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 ${
                        documentOwner ? "transform -translate-y-4 scale-75" : ""
                    }`}
                    >
                    <i className="fas fa-user-tie mr-2"></i> Document Owner
                    </label>
                    <select
                    className="select select-bordered w-full transition duration-300 ease-in-out focus:border-blue-500"
                    value={documentOwner}
                    onChange={(e) => setDocumentOwner(e.target.value)}
                    required
                    >
                    <option value="">Select Document Owner</option>
                    <option value="owner1">Owner 1</option>
                    <option value="owner2">Owner 2</option>
                    </select>
                </div>

                <div className="relative">
                    <label
                    className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 ${
                        developer ? "transform -translate-y-4 scale-75" : ""
                    }`}
                    >
                    <i className="fas fa-code mr-2"></i> Developer
                    </label>
                    <select
                    className="select select-bordered w-full transition duration-300 ease-in-out focus:border-blue-500"
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    required
                    >
                    <option value="">Select Developer</option>
                    <option value="dev1">Developer 1</option>
                    <option value="dev2">Developer 2</option>
                    </select>
                </div>

                <div className="relative">
                    <label
                    className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 ${
                        stakeholder ? "transform -translate-y-4 scale-75" : ""
                    }`}
                    >
                    <i className="fas fa-user-friends mr-2"></i> Stakeholder
                    </label>
                    <select
                    className="select select-bordered w-full transition duration-300 ease-in-out focus:border-blue-500"
                    value={stakeholder}
                    onChange={(e) => setStakeholder(e.target.value)}
                    required
                    >
                    <option value="">Select Stakeholder</option>
                    <option value="stakeholder1">Stakeholder 1</option>
                    <option value="stakeholder2">Stakeholder 2</option>
                    </select>
                </div>
                </div>
            </fieldset>

            {/* Overview */}
            <fieldset className="border border-gray-300 rounded-lg p-4">
                <legend className="text-lg font-semibold">Overview</legend>
                <div className="relative">
                <label
                    className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 ${
                    projectOverview ? "transform -translate-y-4 scale-75" : ""
                    }`}
                >
                    <i className="fas fa-info-circle mr-2"></i> Project Overview
                </label>
                <motion.textarea
                    className="textarea textarea-bordered w-full transition duration-300 ease-in-out focus:border-blue-500 focus:ring focus:ring-blue-200"
                    placeholder=" "
                    value={projectOverview}
                    onChange={(e) => setProjectOverview(e.target.value)}
                    required
                ></motion.textarea>
                </div>
            </fieldset>

            {/* DARCI Roles */}
            <fieldset className="border border-gray-300 rounded-lg p-4">
                <legend className="text-lg font-semibold">DARCI Roles</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    "Decider",
                    "Accountable",
                    "Responsible",
                    "Consulted",
                    "Informed",
                ].map((role) => (
                    <div className="relative" key={role}>
                    <label
                        className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 ${
                        darciRoles[role.toLowerCase()]
                            ? "transform -translate-y-4 scale-75"
                            : ""
                        }`}
                    >
                        <i className="fas fa-user-check mr-2"></i> {role}
                    </label>
                    <select
                        className="select select-bordered w-full transition duration-300 ease-in-out focus:border-blue-500"
                        value={darciRoles[role.toLowerCase()]}
                        onChange={(e) =>
                        setDarciRoles({
                            ...darciRoles,
                            [role.toLowerCase()]: e.target.value,
                        })
                        }
                        required
                    >
                        <option value="">Select {role}</option>
                        <option value="person1">Person 1</option>
                        <option value="person2">Person 2</option>
                        <option value="person3">Person 3</option>
                    </select>
                    </div>
                ))}
                </div>
            </fieldset>

            {/* Dates */}
            <fieldset className="border border-gray-300 rounded-lg p-4">
                <legend className="text-lg font-semibold">Project Dates</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <label
                    className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 ${
                        startDate ? "transform -translate-y-4 scale-75" : ""
                    }`}
                    >
                    <i className="fas fa-calendar-alt mr-2"></i> Start Date
                    </label>
                    <motion.input
                    type="date"
                    className="input input-bordered w-full transition duration-300 ease-in-out focus:border-blue-500 focus:ring focus:ring-blue-200"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    />
                </div>

                <div className="relative">
                    <label
                    className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 ${
                        endDate ? "transform -translate-y-4 scale-75" : ""
                    }`}
                    >
                    <i className="fas fa-calendar-check mr-2"></i> End Date
                    </label>
                    <motion.input
                    type="date"
                    className="input input-bordered w-full transition duration-300 ease-in-out focus:border-blue-500 focus:ring focus:ring-blue-200"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    />
                </div>
                </div>
            </fieldset>

            {/* Submit Button */}
            <div className="flex justify-center">
                <motion.button
                type="submit"
                className="btn btn-primary w-full mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                >
                {loading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                ) : (
                    "Generate PRD"
                )}
                </motion.button>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-center">{error}</p>}
            </form>

            {/* Display Generated PRD */}
            {generatedPRD && <PRDDisplay prd={generatedPRD} />}
        </motion.div>
        </div>
    );
    };

    export default PRDForm;

