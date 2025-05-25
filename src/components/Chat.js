import React, { useState, useRef, useEffect } from 'react';
import '../styles/chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, {
                text: input,
                type: 'user'
            }]);
            setInput('');
            // 这里添加发送消息到后端的逻辑
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} 
                         className={`message-bubble ${message.type === 'user' ? 'user-message' : 'bot-message'}`}>
                        {message.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="input-container">
                <input
                    type="text"
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="输入消息..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="send-button" onClick={handleSend}>
                    发送
                </button>
            </div>
        </div>
    );
};

export default Chat; 