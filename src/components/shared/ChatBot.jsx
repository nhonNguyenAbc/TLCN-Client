import React, { useState } from "react";
import { useSendMessageMutation } from "../../apis/userApi";

const ChatBot = ({ setOpen }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendMessage] = useSendMessageMutation();

  // Tọa độ mặc định
  const DEFAULT_COORDS = { lat: 10.8068864, lng: 106.7726829 };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, userMessage]);

    setMessage("");
    setLoading(true);

    try {
      const data = await sendMessage({ message, ...DEFAULT_COORDS }).unwrap();
      console.log("Phản hồi API:", data);

      // Phản hồi từ chatbot
      const botMessages = [{ sender: "bot", text: data.reply }];
      if (data.restaurants?.length) {
        botMessages.push({
          sender: "bot",
          text: data.restaurants
            .map((r) => `✅ ${r.name} - ${r.address.district}, ${r.address.province}`)
            .join("\n"),
        });
      }

      setChatHistory((prev) => [...prev, ...botMessages]);
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-16 right-4 w-80 bg-white shadow-lg rounded-lg border border-gray-300 h-[500px] flex flex-col">
      {/* Tiêu đề */}
      <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
        <span className="font-bold">Chat với Bot</span>
        <button onClick={() => setOpen(false)} className="text-white hover:text-gray-300">
          ✖
        </button>
      </div>

      {/* Khu vực hiển thị tin nhắn */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {chatHistory.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">Hãy gửi tin nhắn để bắt đầu cuộc trò chuyện!</p>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] p-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-200 text-black self-start"
              }`}
            >
              {msg.text.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Ô nhập tin nhắn */}
      <div className="p-2 border-t flex items-center">
        <textarea
          className="flex-grow p-2 border rounded mr-2 resize-none"
          rows="1"
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSendMessage}
          disabled={loading}
        >
          {loading ? "..." : "Gửi"}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
