import React from 'react';

const AdminPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">View submissions and system analytics</p>
      </div>
      
      <div className="jalsarathi-card p-6 text-center">
        <div className="text-4xl mb-4">📊</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Admin Features</h2>
        <p className="text-gray-600">
          Submission tracking and analytics dashboard will be implemented in the full version.
        </p>
      </div>
    </div>
  );
};

export default AdminPage;