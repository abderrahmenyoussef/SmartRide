import { useEffect, useRef, useState } from 'react';
import { apiRequest } from '../../api/client';
import { useAuth } from '../../hooks/useAuth'
import './ChatWidget.css';

function ChatWidget() {
  const { user, token, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    setMessages([
      {
        role: 'assistant',
        content:
          "Bonjour ! Je suis l'assistant SmartRide. Posez vos questions sur vos trajets, réservations ou prix.",
        timestamp: new Date().toISOString()
      }
    ]);
  }, [isAuthenticated]);

  useEffect(() => {
    const openListener = () => setIsOpen(true);
    window.addEventListener('smartride-open-chat', openListener);
    return () => window.removeEventListener('smartride-open-chat', openListener);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input.trim(), timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);
    setError('');

    try {
      const res = await apiRequest('/ai/chat', {
        method: 'POST',
        data: { message: userMessage.content },
        token
      });
      const reply = res.reply || 'Je rencontre un souci pour récupérer la réponse.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Impossible de contacter l'IA : ${err.message}`,
          isError: true,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "Quels trajets sont disponibles aujourd'hui ?",
    'Comment modifier ma réservation ?',
    'Combien de places restent sur mon trajet ?'
  ];

  const hasUserMessage = messages.some((msg) => msg.role === 'user');

  if (!isAuthenticated) return null;

  return (
    <>
      <button className="chat-toggle-btn" onClick={() => setIsOpen((prev) => !prev)}>
        <i className="fas fa-comments"></i>
        <span>Support IA</span>
      </button>

      {isOpen && (
        <div className="chat-widget">
          <div className="chat-header">
            <div>
              <p className="chat-title">Assistant SmartRide</p>
              <span className="chat-sub">
                Connecté en tant que {user?.username} ({user?.role})
              </span>
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="chat-body">
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.role === 'user' ? 'user' : 'assistant'} ${
                    message.isError ? 'error' : ''
                  }`}
                >
                  <div className="message-meta">
                    <span className="sender">
                      <i className={message.role === 'user' ? 'fas fa-user' : 'fas fa-robot'}></i>
                      {message.role === 'user' ? 'Vous' : 'Assistant'}
                    </span>
                    <span className="time">
                      {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="message-content">{message.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>
          </div>

          <div className="chat-footer">
            {!hasUserMessage && (
              <div className="quick-prompts">
                {quickPrompts.map((prompt) => (
                  <button key={prompt} onClick={() => setInput(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            <div className="chat-input">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                onKeyDown={handleKeyDown}
              ></textarea>
              <button onClick={sendMessage} disabled={isSending || !input.trim()}>
                {isSending ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
              </button>
            </div>
            {error && (
              <div className="chat-error">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
