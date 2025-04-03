import React, { useState } from "react";
import { XCircleIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import ChatBot from "./ChatBot";

const ChatbotButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Nút mở chatbot */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition duration-300"
        >
          <ChatBubbleLeftIcon className="w-8 h-8" />
        </button>
      )}

      {/* Form chatbot */}
      {open && <ChatBot setOpen={setOpen} />}
    </div>
  );
};

export default ChatbotButton;
