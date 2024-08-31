import Button from "../../components/UI/Button";

export default function Chat() {
  return (
    <div>
      <div className="flex flex-row mb-6 justify-between items-center">
        <h2 className="text-lg font-semibold">Chats</h2>
        <div>
          <Button loading={false} variant="primary">
            Connect Chat
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* Client list */}
        <div className="w-1/4 bg-gray-100 overflow-y-auto">
          <h3 className="text-lg font-semibold p-4">Clients</h3>
          <ul>
            {["Client 1", "Client 2", "Client 3"].map((client, index) => (
              <li key={index} className="p-4 hover:bg-gray-200 cursor-pointer">
                {client}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat area */}
        <div className="w-3/4 flex flex-col">
          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto">
            {/* Sample messages */}
            <div className="mb-4">
              <div className="bg-blue-100 p-2 rounded-lg inline-block">
                Hello! How can I help you today?
              </div>
            </div>
            <div className="mb-4 text-right">
              <div className="bg-green-100 p-2 rounded-lg inline-block">
                I have a question about my contract.
              </div>
            </div>
          </div>

          {/* Input area */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <button className="mr-2 text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>
              <button className="mr-2 text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={() => {}}
                variant="primary"
                className="rounded-l-none"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
