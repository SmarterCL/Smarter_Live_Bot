
import React from 'react';
import { Message, Sender } from '../types';
import UserIcon from './icons/UserIcon';
import BotIcon from './icons/BotIcon';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;

  const Avatar = isUser ? UserIcon : BotIcon;
  const bgColor = isUser ? 'bg-blue-600' : 'bg-gray-700';
  const textColor = 'text-white';
  const alignment = isUser ? 'justify-end' : 'justify-start';
  const avatarColor = isUser ? 'text-blue-200' : 'text-cyan-400';

  return (
    <div className={`flex items-start gap-3 my-4 ${alignment}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-800 flex items-center justify-center">
          <Avatar className={`w-6 h-6 ${avatarColor}`} />
        </div>
      )}
      <div
        className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl ${bgColor} ${textColor} whitespace-pre-wrap`}
      >
        <p>{message.text}</p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-800 flex items-center justify-center">
          <Avatar className={`w-6 h-6 ${avatarColor}`} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
