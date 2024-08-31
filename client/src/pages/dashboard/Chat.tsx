import Bubble from "../../components/Chat/Bubble";
import ClientList from "../../components/Chat/ClientList";
import Button from "../../components/UI/Button";
import EmojiSelect from "../../components/UI/EmojiSelect";

export default function Chat() {
  const messages = [
    {
      isUser: true,
      message: "Hello! How can I help you today?",
      time: "10:00 AM",
      status: "Sent",
    },
    {
      isUser: false,
      message: "Hi there! I have a question about my account.",
      time: "10:02 AM",
      status: "Received",
    },
    {
      isUser: true,
      message:
        "Of course! I'd be happy to assist you with your account. What specific question do you have?",
      time: "10:05 AM",
      status: "Sent",
    },
    {
      isUser: false,
      message:
        "I'm trying to update my billing information, but I'm having trouble finding where to do that.",
      time: "10:08 AM",
      status: "Received",
    },
    {
      isUser: true,
      message:
        "No problem! I can guide you through that process. First, go to your account settings by clicking on your profile picture in the top right corner.",
      time: "10:10 AM",
      status: "Sent",
    },
  ];

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
        <div className="w-1/4 ">
          <ClientList />
        </div>

        <div className="w-3/4 flex bg-white border rounded-lg flex-col">
          <div className="flex-grow p-8  overflow-y-auto">
            {messages.map((e, i) => (
              <Bubble
                key={i}
                isUser={e.isUser}
                message={e.message}
                time={e.time}
                status={e.status}
              />
            ))}
          </div>

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
