import ChatWindow from '../components/ChatWindow';
import { HiSparkles } from 'react-icons/hi';

const AIGuru = () => {
  return (
    <div className="flex flex-col max-w-3xl mx-auto h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
          <HiSparkles size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Finance Guru</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ask anything about your finances and spending habits.
          </p>
        </div>
      </div>

      {/* Chat window */}
      <div className="card flex-1 flex flex-col min-h-0 p-0 overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
};

export default AIGuru;
