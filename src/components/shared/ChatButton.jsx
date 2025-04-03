import React, { useState } from "react";
import ChatComponent from "./ChatComponent";
import { ChatBubbleLeftEllipsisIcon, XMarkIcon } from "@heroicons/react/24/solid";

const ChatButton = ({ userId, ownerId, restaurantId, userName }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {isOpen && (
        <ChatComponent userId={userId} ownerId={ownerId} restaurantId={restaurantId} userName={userName} />
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600"
      >
        {isOpen ? <XMarkIcon className="w-6 h-6" /> : <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatButton;
