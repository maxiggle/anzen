import React, { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojiSelectProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiSelect: React.FC<EmojiSelectProps> = ({ onEmojiSelect }) => {
  const [showPicker, setShowPicker] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEmojiSelect = (emoji: any) => {
    onEmojiSelect(emoji.native);
    setShowPicker(false);
  };

  return (
    <div className="relative inline-flex items-center ">
      <button
        className="text-gray-500 hover:text-gray-700"
        onClick={() => setShowPicker(!showPicker)}
      >
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
      {showPicker && (
        <div className="absolute bottom-full mb-2 z-10">
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            set="apple"
          />
        </div>
      )}
    </div>
  );
};

export default EmojiSelect;
