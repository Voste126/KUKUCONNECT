import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');

    const sendMessage = async () => {
        const userMessage: Message = { sender: 'user', text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            const response = await axios.post<{ response: string }>('http://127.0.0.1:8000/api/chatbot/', {
                user_input: input
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const botMessage: Message = { sender: 'bot', text: response.data.response };
            setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setInput('');
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
                    placeholder="Type a message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;