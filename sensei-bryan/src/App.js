import './App.css';
import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const newMessages = [...messages, { text: inputMessage, sender: 'user' }];
    setMessages(newMessages);

    // TODO: Add your AI API call here
    // For now, we'll just echo back a response
    const botResponse = {
      text: `I received your message: "${inputMessage}"`,
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
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;