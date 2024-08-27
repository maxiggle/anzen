import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">HR Portal</h1>
          <Link
            to="/account-type"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center mb-8">
          Welcome to Our HR Portal
        </h2>
        <p className="text-xl text-center mb-12">
          Streamline your HR processes with our powerful tools.
        </p>
        {/* Add more content for the landing page */}
      </main>
    </div>
  );
};
export default HomePage;
