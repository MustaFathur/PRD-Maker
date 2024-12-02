![AlgoNetwork_Logo](https://github.com/user-attachments/assets/850d4b52-0f01-4bc9-a650-d55226d4e26d)

# **PRD Maker with LLM**  
**Bangkit 2024 Algo Network Company Track CASE 2 Capstone Project**

## **Overview**
**PRD Maker** is a web-based application designed to simplify and accelerate the creation of Product Requirements Documents (PRD). By leveraging a user-friendly input form and a powerful Large Language Model (LLM), the application generates optimized PRDs tailored to project needs. Users can edit the generated PRD for accuracy and download the finalized document as a professionally styled PDF.

- 🌟 **User-Friendly Interface**: Input project details like version, product name, and timeline easily.  
- 🤖 **AI-Driven PRD Generation**: Generate structured PRDs using LLM-powered optimization (Gemini API).  
- 🖊 **Editable Outputs**: Ensure completeness and correctness with a real-time editor for the generated PRD.  
- 📄 **Downloadable PDF**: Save finalized PRDs as styled PDF documents.  

## **Team Members**
We are a team of Bangkit 2024 Cohorts from different learning paths and universities:

| **Name**                | **Bangkit ID**  | **Learning Path**   | **University**           |
|:-----------------------:|:---------------:|:-------------------:|:------------------------:|
| Fizio Ramadhan Herman   | M012B4KY1544    | Machine Learning    | Universitas Telkom       |
| Muhammad Daffa Arigoh   | M315B4KY2769    | Machine Learning    | Universitas Sriwijaya    |
| Rafi Muhamad Nabil      | C287B4KY3584    | Cloud Computing     | Universitas Pakuan       |
| Mustafa Fathur Rahman   | C184B4KY3159    | Cloud Computing     | Universitas Andalas      |

## **Tech Stack**

| **Technology**        | **Purpose**                                  |
|-----------------------|---------------------------------------------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) | Frontend framework for dynamic UI.  |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) | Temporary API and backend routing.  |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | Middleware and API integration.     |
| ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) | Backend for LLM (Flask).            |
| ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | For responsive and modern styling.  |
| ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) | For containerizing the application. |
| ![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white) | Cloud Technology for deployment.       |

## **Project Workflow**

### **Frontend**:
1. Users fill in the PRD form via a React-based UI.
2. Form inputs are converted into a JSON object.

### **Backend**:
1. **Flask** processes the input JSON via an LLM API (Gemini).
2. LLM generates optimized PRD content.
3. Generated JSON output.

### **Output**:
1. The generated PRD is displayed in real-time on the frontend (editable).
2. Finalized PRDs are downloadable as PDFs with professional styling.

## **How to Contribute**
1. Clone the repository:
   ```bash
   git clone https://github.com/MustaFathur/PRD-Maker-With-LLM.git
   cd PRD-Maker-With-LLM
2. Install dependencies and Run the services locally:
   ```bash
   # For frontend
   cd Cloud_Computing/frontend
   npm install
   npm run tailwind
   npm run dev

   # For backend (Express)
   cd Cloud_Computing/backend
   npm install
   
   # Configure the database
   cp .env.example .env
   # Update the .env file with your database credentials

   # Run migrations
   npx sequelize-cli db:migrate

   npm run dev

   # For LLM (Flask)
   cd Machine_Learning
   pip install -r requirements.txt
   python app.py
