import React from "react";
const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-gray-800">
            HR Portal Dashboard
          </h1>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Welcome to Your Dashboard</h2>
        {/* Add dashboard content here */}
      </main>
    </div>
  );
};
export default Dashboard;
