import './App.css';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const newMessages = [...messages, { text: inputMessage, sender: 'user' }];
    setMessages(newMessages);

    // TODO: Add AI API call here
    const botResponse = {
      text: `bot will be replying to: "${inputMessage}"`,
      sender: 'bot'
    };

    setMessages([...newMessages, botResponse]);
    setInputMessage('');
  };

  return (
    <div className="App">
      <div className="chat-container">
        <header className="App-header">
          <h1 className="titleText">Sensei Bryan</h1>
        </header>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.sender}-message`}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Scroll anchor */}
        </div>
        <div className="chat-input">
          <textarea
            id='inputMessage'
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Message your Sensei"
            rows="1"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;