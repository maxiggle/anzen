export default function Support() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Support Center
        </h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              How can we help you?
            </h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-300">
                <svg
                  className="h-6 w-6 text-blue-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700">FAQs</span>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition duration-300">
                <svg
                  className="h-6 w-6 text-green-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-700">Contact Us</span>
              </div>
              <div className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition duration-300">
                <svg
                  className="h-6 w-6 text-purple-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span className="text-gray-700">Knowledge Base</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4">
            <p className="text-sm text-gray-600">
              Can't find what you're looking for? Our support team is here to
              help 24/7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
