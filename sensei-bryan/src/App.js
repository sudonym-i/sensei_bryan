/**
 * Sensei Bryan - AI Chat Application
 * 
 * This is the main React component that implements the chat interface.
 * It handles message state management, API communication with the Netlify function,
 * and provides a responsive UI for user interactions.
 * 
 * Features:
 * - Real-time chat interface
 * - Auto-scrolling messages
 * - Mobile-responsive design
 * - Error handling and user feedback
 */

import './App.css';
import { useState, useEffect, useRef } from 'react';


  // --------------- mode toggle functionality --------------- //
  const modes = [
    {
      name: 'teaching',
      label: 'Teaching Mode',
      description: 'Ask Sensei Bryan questions, and get detailed explanations. Bryan will ask you follow-up questions to clarify your understanding after each response.',
      color: 'var(--green)',
      context: 'Use these rules when responding to the question below: 1 - Never completely answer a question, rather, encourage the asker to think. 2 - always ask a question after explaining, in order to test understanding. 3 - be as specific as possible. Here is the question:',
    },
    {
      name: 'testing',
      label: 'Testing Mode',
      description: 'Test your knowledge with quizzes and challenges. Sensei Bryan will evaluate you responses and helo steer you in the correct directiond.',
      color: 'var(--orange)',
      context: 'make me a practice test out of the following prompt, with multiple questions testing different skills/knowledge. check the answer that I give afterwards. Here is the prompt:'
    },
    {
      name: 'memorization',
      label: 'Memory Mode',
      description: 'Some memorization exercises to help reinforce your learning.',
      color: 'var(--purple)',
      context: 'Make an exercise to help me memorize the following text. Ask me questions about it afterwards to test my memory. try to do something similar to how flalshcards work. Here is the text:'
    }
  ];


// --------------- main App components --------------- //
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

    setInputMessage('');
    //clear users input field (the messag box)

    setMessages([...newMessages, {
        text: "Thinking...",
        sender: 'bot',
      }]);
      // give an indicator that the response is loading
    
    setMessages(newMessages);

    // Send the message to the server, and handle the response (error or success)
    try {
      console.log('Sending request to function...');
      const response = await fetch('/.netlify/functions/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: currentMode.context + inputMessage }),
      });

      console.log('Response status:', response.status);

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok || data.error) {
        throw new Error(data?.error || `HTTP error! status: ${response.status}`);
      }

      setMessages([...newMessages, {
        text: data.result,
        sender: 'bot',
      }]);
    } catch (error) {
      console.error('Error details:', error);
      setMessages([...newMessages, {
        text: `Error: ${error.message}`,
        sender: 'bot',
      }]);
    }
  };



  const [currentMode, setCurrentMode] = useState(modes[0]);
  const [isTrayVisible, setIsTrayVisible] = useState(false);

  // Handle tray visibility
  const toggleTray = () => {
    setIsTrayVisible(!isTrayVisible);
    // Add or remove body class for mobile scrolling
    document.body.classList.toggle('tray-open', !isTrayVisible);
  };

  const createRipple = (event) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    // Handle touch events for mobile
    const x = (event.clientX || event.touches[0].clientX) - rect.left - size / 2;
    const y = (event.clientY || event.touches[0].clientY) - rect.top - size / 2;
    
    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  };

  const handleModeToggle = (event) => {
    createRipple(event);
    const currentIndex = modes.findIndex(mode => mode.name === currentMode.name);
    const nextIndex = (currentIndex + 1) % modes.length;
    setCurrentMode(modes[nextIndex]);
  };


  return (
    <div className="App">
          <button 
            className="tray-toggle"
            onClick={toggleTray}
            aria-label="Toggle settings"
          />
          <div className={`toggle-container ${currentMode.name} ${isTrayVisible ? 'visible' : ''}`}>
            <button 
              className={`mode-toggle ${currentMode.name}`}
              onClick={handleModeToggle}
            >
              {currentMode.label}
            </button>
            <div className="mode-description">
              {currentMode.description}
            </div>
          </div>
      <div className={`chat-container ${isTrayVisible ? 'tray-open' : ''}`}>
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
          <button className={`send-button ${currentMode.name}`} onClick={handleSendMessage} >Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;