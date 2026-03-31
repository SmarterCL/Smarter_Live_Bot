
import React from 'react';
import BotIcon from './icons/BotIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 shadow-lg fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex items-center gap-3">
        <BotIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-xl font-bold text-white">Gemini AI Chat</h1>
      </div>
    </header>
  );
};

export default Header;
