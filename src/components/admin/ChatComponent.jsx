import React, { useEffect, useState } from "react";
import { db } from "../../configs/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { UserIcon } from "@heroicons/react/24/solid"; // Import icon màu trắng

const ChatComponent = ({ userId, ownerId, restaurantId, userName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!restaurantId || !userId || !ownerId) return;

    // Lấy tin nhắn giữa 2 người trong một nhà hàng
    const q = query(
      collection(db, "chats"),
      where("restaurantId", "==", restaurantId),
      where("participants", "array-contains", userId),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(chatData);
    });

    return () => unsubscribe();
  }, [restaurantId, userId, ownerId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "chats"), {
      restaurantId,
      sender: userId,
      senderName: userName || "Restaurant", // Thay bằng tên thực tế
      receiver: ownerId,
      participants: [userId, ownerId],
      message: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div className=" bottom-16  justify-center bg-white shadow-lg rounded-lg w-[100vh] h-[80vh] flex flex-col p-4">
      <div className="text-lg font-semibold mb-2">💬 Trò chuyện</div>

      <div className="flex-1 overflow-auto space-y-2 p-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end ${
              msg.sender === userId ? "justify-end" : "justify-start"
            }`}
          >
            {/* Avatar */}
            {msg.sender !== userId && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm mr-2">
                👤
              </div>
            )}

            {/* Tin nhắn */}
            <div
              className={`p-2 max-w-[70%] rounded-lg shadow-md ${
                msg.sender === userId
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.message}
            </div>

            {/* Avatar của chính user */}
            {msg.sender === userId && (
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm ml-2">
                  <UserIcon className="w-6 h-6 text-white bg-blue-500 rounded-full p-1 " />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ô nhập tin nhắn */}
      <div className="mt-2 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border p-2 flex-1 rounded-l-lg focus:outline-none"
          placeholder="Nhập tin nhắn..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
