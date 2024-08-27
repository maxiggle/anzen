import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="bg-one min-h-[550px] px-24 py-6">
      <nav className="flex justify-between items-center px-6 py-4">
        <div className="flex">
          <img src="/path/to/logo.png" alt="Logo" className="h-8 w-auto mr-4" />
        </div>
        <div className="flex space-x-6">
          <Link to="/product" className="text-gray-800 hover:text-gray-600">
            Product
          </Link>
          <Link to="/solution" className="text-gray-800 hover:text-gray-600">
            Solution
          </Link>
          <Link to="/partners" className="text-gray-800 hover:text-gray-600">
            Partners
          </Link>
          <Link to="/resources" className="text-gray-800 hover:text-gray-600">
            Resources
          </Link>
          <Link
            to="/account-type"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="w-full min-h-screen px-4 py-12">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Welcome to Our HR Portal</h2>
          <p className="text-xl mb-8">
            Streamline your HR processes with our powerful tools.
          </p>
          <Link
            to="/account-type"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg"
          >
            Get Started
          </Link>
        </section>

        <section className="mb-12">
          <h3 className="text-3xl font-bold text-center mb-6">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-2">AI-Powered Contracts</h4>
              <p>
                Generate and review contracts with the help of AI, ensuring
                accuracy and efficiency.
              </p>
            </div>
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-2">Blockchain Integration</h4>
              <p>
                Secure your HR processes with blockchain technology for
                transparency and trust.
              </p>
            </div>
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-2">Modular System</h4>
              <p>
                Customize the platform to suit your organizational needs with
                our modular system.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-3xl font-bold text-center mb-6">Testimonials</h3>
          <div className="flex flex-col md:flex-row justify-around">
            <div className="bg-white shadow-lg p-6 rounded-lg mb-6 md:mb-0">
              <p className="italic">
                "The AI contracts saved us so much time and ensured legal
                compliance!"
              </p>
              <p className="font-bold mt-4">- Jane Doe, HR Manager</p>
            </div>
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <p className="italic">
                "The integration with blockchain technology has given us peace
                of mind."
              </p>
              <p className="font-bold mt-4">- John Smith, CEO</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Revolutionize Your HR?
          </h3>
          <Link
            to="/account-type"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg"
          >
            Sign Up Today
          </Link>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 HR Portal. All rights reserved.</p>
          <Link
            to="/privacy-policy"
            className="text-gray-400 hover:text-gray-200 text-sm"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
