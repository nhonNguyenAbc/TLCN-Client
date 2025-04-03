import React, { useState, useEffect } from "react";
import { db } from "../../configs/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import ChatComponent from "../admin/ChatComponent";

const userId = localStorage.getItem("userId")

const Chat = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        if (!userId) return;
    
        const q = query(
            collection(db, "chats"),
            where("participants", "array-contains", userId)
        );
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatUsers = [];
            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                const otherUser = data.participants.find((p) => p !== userId);
    
                if (otherUser && !chatUsers.some((user) => user.id === otherUser)) {
                    chatUsers.push({
                        id: otherUser,
                        name: data.sender === otherUser ? data.senderName : `User ${otherUser}`, 
                        avatar: "👤",
                    });
                }
            });
    
            setChats(chatUsers);
        });
    
        return () => unsubscribe();
    }, [userId]);
    

    return (
        <div className="fixed bg-white shadow-md rounded-lg w-[300px] h-96 flex flex-col">
            {!selectedChat ? (
                <div className="p-4">
                    <h2 className="text-lg font-bold mb-2">Danh sách chat</h2>
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className="p-2 bg-gray-200 rounded-lg flex items-center cursor-pointer mb-2 hover:bg-gray-300"
                            onClick={() => setSelectedChat(chat)}
                        >
                            <div className=" h-8 min-w-8 rounded-full bg-gray-400  flex items-center justify-center mr-2">
                                {chat.avatar}
                            </div>
                            <span>{chat.name}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full">
                    <div className="p-2 bg-gray-300 flex items-center">
                        <button onClick={() => setSelectedChat(null)} className="mr-2 text-lg font-bold">
                            ⬅
                        </button>
                        <span className="font-bold">{selectedChat.name}</span>
                    </div>
                    <ChatComponent userId={userId} ownerId={selectedChat.id} restaurantId="67d7e02b45159a0597f38da0" />
                </div>
            )}
        </div>
    );
};

export default Chat;
