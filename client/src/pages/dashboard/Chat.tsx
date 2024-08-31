import Button from "../../components/UI/Button";
import EmojiSelect from "../../components/UI/EmojiSelect";

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
        <div className="w-1/4  border rounded-lg bg-white border-gray-200 mr-4 overflow-y-auto">
          <h3 className="text-lg font-semibold p-4 border-b border-gray-200">
            Clients
          </h3>
          <ul className="divide-y divide-gray-200">
            {["Client 1", "Client 2", "Client 3"].map((client, index) => (
              <li
                key={index}
                className="p-4 hover:bg-gray-200 cursor-pointer transition duration-150 ease-in-out flex items-center"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full mr-3 flex items-center justify-center text-white font-semibold border border-blue-600">
                  {client.charAt(0)}
                </div>
                <span>{client}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat area */}
        <div className="w-3/4 flex bg-white border rounded-lg flex-col">
          {/* Messages */}
          <div className="flex-grow p-4  overflow-y-auto">
            {/* Sample messages */}
            <div className="mb-4">
              <div className="bg-blue-100 p-3 rounded-lg inline-block max-w-3/4 border border-blue-200 relative">
                <p>Hello! How can I help you today?</p>
                <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-r-8 border-b-8 border-blue-100 border-r-transparent border-b-transparent"></div>
                <div className="text-xs text-gray-500 mt-1">
                  10:30 AM | <span className="text-blue-500">●</span>
                </div>
              </div>
            </div>
            <div className="mb-4 text-right">
              <div className="bg-green-100 p-3 rounded-lg inline-block max-w-3/4 border border-green-200 relative">
                <p>I have a question about my contract.</p>
                <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-l-8 border-b-8 border-green-100 border-l-transparent border-b-transparent"></div>
                <div className="text-xs text-gray-500 mt-1">
                  10:32 AM | <span className="text-green-500">●●</span>
                </div>
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
              <div className="mr-2 mt-1 text-gray-500 hover:text-gray-700">
                <EmojiSelect
                  onEmojiSelect={(e) => {
                    console.log(e);
                  }}
                />
              </div>
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
