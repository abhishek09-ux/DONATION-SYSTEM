import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Chatbot = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        type: 'bot',
        text: '👋 **Hey there!** I\'m your DonateMatch Assistant!\n\nI know everything about this platform. Ask me about:\n\n🔍 Finding charities & campaigns\n💝 How to donate\n🧾 Tax benefits (80G)\n⚙️ Website features & navigation\n🌐 Changing language\n\nWhat would you like to know?',
        quickReplies: ['🔍 Find charities', '💝 How to donate', '🧾 Tax benefits', '❓ About DonateMatch']
      };
      setMessages([welcomeMessage]);
      fetchSuggestions();
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSuggestions = async () => {
    try {
      const response = await api.get('/chatbot/suggestions');
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Simulate typing effect for bot messages
  const typeMessage = useCallback((text, callback) => {
    setIsTyping(true);
    // Delay based on message length (min 500ms, max 1500ms)
    const delay = Math.min(1500, Math.max(500, text.length * 10));
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await api.post('/chatbot/message', { 
        message: text,
        context: messages.slice(-5).map(m => ({ type: m.type, text: m.text }))
      });
      
      typeMessage(response.data.text, () => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: response.data.text,
          quickReplies: response.data.quickReplies,
          data: response.data.data,
          messageType: response.data.type,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      });
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: '😅 Oops! Something went wrong. Let me try again...\n\nIn the meantime, try these options:',
        quickReplies: ['How to donate', 'Find charities', 'Contact support'],
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickReply = (reply) => {
    // Remove emoji from beginning if present
    const cleanReply = reply.replace(/^[^\w\s]+\s*/, '');
    sendMessage(cleanReply);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // Format message text with markdown-like syntax
  const formatMessage = (text) => {
    if (!text) return '';
    
    // Bold text **text**
    let formatted = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    
    // Convert newlines to breaks
    formatted = formatted.split('\n').map((line, i) => (
      <span key={i}>
        {i > 0 && <br />}
        <span dangerouslySetInnerHTML={{ __html: line }} />
      </span>
    ));
    
    return formatted;
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-50 p-4 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 ${
          isOpen 
            ? 'bg-gray-600 hover:bg-gray-700 rotate-0' 
            : 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 hover:scale-110 animate-pulse hover:animate-none'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open AI Assistant'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-6rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-slate-700 animate-fade-in"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
          role="dialog"
          aria-label="AI Chat Assistant"
          onKeyDown={handleKeyDown}
        >
          {/* Header with gradient */}
          <div className="p-4 bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">DonateMatch AI</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Always here to help</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-800/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              >
                {/* Bot Avatar */}
                {message.type === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] rounded-2xl p-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-br-md'
                      : message.isError
                      ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 rounded-bl-md'
                      : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-slate-700 rounded-bl-md'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {formatMessage(message.text)}
                  </div>
                  
                  {/* Quick Replies */}
                  {message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-1.5 text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all hover:scale-105"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Charity/Campaign Cards */}
                  {message.data?.charities && message.data.charities.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.data.charities.map((charity, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleNavigate(`/charities/${charity._id}`)}
                          className="w-full text-left p-3 bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-all border border-gray-200 dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-700"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-gray-900 dark:text-white">{charity.organizationName}</span>
                            {charity.is80GRegistered && (
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">80G</span>
                            )}
                          </div>
                          {charity.rating?.average && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <span>⭐</span>
                              <span>{charity.rating.average.toFixed(1)}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {message.data?.campaigns && message.data.campaigns.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.data.campaigns.map((campaign, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleNavigate(`/campaigns/${campaign._id}`)}
                          className="w-full text-left p-3 bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-all border border-gray-200 dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-700"
                        >
                          <span className="font-medium text-sm text-gray-900 dark:text-white">{campaign.title}</span>
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                              <span>₹{(campaign.raisedAmount || 0).toLocaleString()}</span>
                              <span>₹{(campaign.goalAmount || 0).toLocaleString()}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all"
                                style={{ width: `${Math.min(100, ((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className={`mt-1 text-xs ${message.type === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                    {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {(isLoading || isTyping) && (
              <div className="flex justify-start animate-slide-up">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center mr-2 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-md p-4 shadow-sm border border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions Bar */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 overflow-x-auto">
              <div className="flex gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickReply(suggestion)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-slate-600 hover:border-primary-300 hover:text-primary-600 dark:hover:border-primary-700 dark:hover:text-primary-400 transition-colors whitespace-nowrap"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex gap-2">
              {/* Suggestions Toggle */}
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className={`p-2.5 rounded-xl transition-colors ${
                  showSuggestions 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' 
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
                title="Show suggestions"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </button>
              
              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                disabled={isLoading || isTyping}
                aria-label="Type your message"
              />
              
              {/* Send Button */}
              <button
                type="submit"
                disabled={isLoading || isTyping || !inputValue.trim()}
                className="p-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all disabled:hover:from-primary-600 disabled:hover:to-purple-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </div>
            
            {/* Powered by text */}
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
              ✨ AI-powered • Knows everything about DonateMatch
            </p>
          </form>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Chatbot;
