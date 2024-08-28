import React, { useState, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate(); // Replaces useHistory
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const accountType = new URLSearchParams(location.search).get("type");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your registration logic here
    console.log("Registered as", accountType, "with email:", email);
    navigate("/dashboard"); // Replaces history.push
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-1/2 bg-blue-600">
        {/* Add your image here */}
        <div className="h-full flex items-center justify-center">
          <h2 className="text-4xl font-bold text-white">
            Welcome to HR Portal
          </h2>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Register as{" "}
            {accountType === "company" ? "a Company" : "a Contractor"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
