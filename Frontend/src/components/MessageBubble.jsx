// MessageBubble — renders a single chat message

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold
          ${isUser
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200'
          }`}
      >
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap
          ${isUser
            ? 'bg-primary-600 text-white rounded-tr-sm'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-tl-sm'
          }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
