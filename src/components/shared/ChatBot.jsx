import React, { useState, useRef, useEffect } from "react";
import { useSendMessageMutation } from "../../apis/userApi";

const ChatBot = ({ setOpen }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendMessage] = useSendMessageMutation();

  const chatEndRef = useRef(null);

  // Tọa độ mặc định
  const DEFAULT_COORDS = { lat: 10.8068864, lng: 106.7726829 };

  // Tự động scroll xuống cuối mỗi khi chatHistory thay đổi
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, userMessage]);

    setMessage("");
    setLoading(true);

    try {
      const data = await sendMessage({ message, ...DEFAULT_COORDS }).unwrap();
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
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "Có lỗi xảy ra, vui lòng thử lại sau." },
      ]);
      console.error("Lỗi gửi tin nhắn:", err);
    } finally {
      setLoading(false);
    }
  };

  // Gửi khi nhấn Enter (ko shift + Enter)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-16 right-4 w-96 max-w-full bg-white shadow-xl rounded-lg border border-gray-300 flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-600 rounded-t-lg text-white font-semibold text-lg">
        <span>Chat với Bot</span>
        <button
          onClick={() => setOpen(false)}
          className="text-white hover:text-gray-200 transition"
          aria-label="Đóng chatbot"
        >
          ✖
        </button>
      </div>

      {/* Nội dung chat */}
      <div className="flex-1 px-4 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100">
        {chatHistory.length === 0 ? (
          <p className="text-gray-400 text-center italic mt-10">
            Hãy gửi tin nhắn để bắt đầu cuộc trò chuyện!
          </p>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[70%] mb-3 p-3 rounded-lg whitespace-pre-wrap break-words shadow-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white self-end ml-auto rounded-br-none"
                  : "bg-gray-100 text-gray-900 self-start rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-gray-300 p-3 flex items-center gap-2">
        <textarea
          className="flex-grow resize-none border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={1}
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !message.trim()}
          className={`px-4 py-2 rounded-md font-semibold text-white transition ${
            loading || !message.trim()
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          aria-label="Gửi tin nhắn"
        >
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
