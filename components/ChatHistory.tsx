
import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isLoading && messages[messages.length - 1]?.sender === 'user' && (
        <div className="flex items-start gap-3 my-4 justify-start">
            <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-800 flex items-center justify-center">
                <div className="w-6 h-6 text-cyan-400 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
            </div>
            <div className="max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl bg-gray-700 text-white">
                <p className="italic">Gemini is thinking...</p>
            </div>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatHistory;
