import { useState, useRef, useEffect } from 'react';
import { HiPaperAirplane } from 'react-icons/hi';
import MessageBubble from './MessageBubble';
import { analyzeExpenses } from "../services/aiService";

const exampleQuestions = [
  'How can I save more money?',
  'Analyze my spending.',
  'Which category costs me the most?',
  'Suggest a monthly budget.',
];

// ChatWindow — the AI Finance Guru chat interface
const ChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Finance Guru. Ask me anything about your finances, spending habits, or budgeting tips.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

const sendMessage = async (text) => {
  const userMsg = text || input.trim();

  if (!userMsg || isLoading) return;

  const updatedMessages = [
    ...messages,
    {
      role: "user",
      content: userMsg,
    },
  ];

  setMessages(updatedMessages);
  setInput("");
  setIsLoading(true);

  try {
    // Last 10 messages only
    const history = updatedMessages.slice(0,-1).slice(-10);

    const data = await analyzeExpenses(userMsg, history);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.response,
      },
    ]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Sorry! Something went wrong.",
      },
    ]);
  }

  setIsLoading(false);
};

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-200">
              AI
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Example questions */}
      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-xs bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 px-2.5 py-1 rounded-full transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input row */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something about your finances..."
            className="input-field flex-1"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <HiPaperAirplane size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
