import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useForm from "../../hooks/useForm";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { type: accountType } = useParams<{ type: string }>();

  const { form, setFormValue, submit } = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    action: async ({ email }) => {
      return Promise.resolve(email);
    },
    success() {
      navigate("/dashboard");
    },
  });

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
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={setFormValue}
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
                name="password"
                value={form.password}
                onChange={setFormValue}
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
