import React from "react";
import { Link } from "react-router-dom";

const AccountType: React.FC = () => {
  return (
    <div className="min-h-screen bg-koi bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Choose Account Type
        </h2>
        <div className="space-y-4">
          <Link
            to="/register/company"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded text-center"
          >
            Register as a Company
          </Link>
          <Link
            to="/register/contractor"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded text-center"
          >
            Register as a Contractor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountType;
