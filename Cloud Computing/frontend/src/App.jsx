import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Guest/Homepage';
import Login from './components/Guest/Login';
import Register from './components/Guest/Register';
import PRDForm from './components/Users/PRDForm';
import Dashboard from './components/Users/Dashboard';
import Personil from './components/Users/Personil';
import PRDList from './components/Users/PRDList';
import PRDDetail from './components/Users/PRDDetail'; // Import PRDDetail component
import PrivateRoute from './components/Logic/PrivateRoute';
import PublicRoute from './components/Logic/PublicRoute';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<PublicRoute><Homepage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/create-prd" element={<PrivateRoute><PRDForm /></PrivateRoute>} />
          <Route path="/prd-list" element={<PrivateRoute><PRDList /></PrivateRoute>} />
          <Route path="/prd/:id" element={<PrivateRoute><PRDDetail /></PrivateRoute>} /> {/* Add PRDDetail route */}
          <Route path="/personil" element={<PrivateRoute><Personil /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;