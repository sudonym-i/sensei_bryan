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

  useEffect(() => {
    // Handle viewport height for mobile browsers
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);

    return () => window.removeEventListener('resize', setVH);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { text: inputMessage, sender: 'user' }];
    setMessages(newMessages);

    try {
        console.log('Sending request to function...');
        const response = await fetch('/.netlify/functions/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: inputMessage }),
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.error) {
            throw new Error(data.error);
        }

        setMessages([...newMessages, { 
            text: data.result, 
            sender: 'bot'
        }]);
    } catch (error) {
        console.error('Error details:', error);
        setMessages([...newMessages, { 
            text: `Error: ${error.message}`, 
            sender: 'bot'
        }]);
    }

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