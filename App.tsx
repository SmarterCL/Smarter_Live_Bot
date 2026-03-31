
import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender } from './types';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import {
  findOrCreateContact,
  getConversationMessages,
  sendMessageToChatwoot,
  createConversation,
} from './services/geminiService'; // Renamed from geminiService, but path remains

const POLLING_INTERVAL = 3000; // Poll every 3 seconds
const POLLING_TIMEOUT = 60000; // Stop polling after 60 seconds

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState<any>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);

  const pollingTimeoutRef = useRef<number | null>(null);
  const pollingIntervalRef = useRef<number | null>(null);


  // Initialize contact and load initial messages on component mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const chatwootContact = await findOrCreateContact();
        setContact(chatwootContact);

        const { messages: initialMessages, conversationId: convId } = await getConversationMessages(chatwootContact);
        
        if (convId !== -1) {
            setConversationId(convId);
        }

        const formattedMessages: Message[] = initialMessages.map((msg: any) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.message_type === 0 ? Sender.USER : Sender.BOT,
        })).sort((a,b) => a.id - b.id);

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Initialization failed:", error);
        // You might want to show an error message in the UI here
      }
    };
    initializeChat();
  }, []);

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
    }
    if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
    }
    setIsLoading(false);
  };
  
  // Effect to clean up timers on unmount
  useEffect(() => {
    return () => stopPolling();
  }, []);

  const pollForReply = () => {
    if (!contact) return;

    // Stop polling if it takes too long
    pollingTimeoutRef.current = window.setTimeout(() => {
        console.warn("Polling timed out.");
        stopPolling();
        // Optionally add an error message to chat
        setMessages(prev => [...prev, {
            id: `error-${Date.now()}`,
            text: "No response from the server. Please try again later.",
            sender: Sender.BOT
        }])
    }, POLLING_TIMEOUT);

    pollingIntervalRef.current = window.setInterval(async () => {
      try {
        const { messages: currentMessages } = await getConversationMessages(contact);
        const lastKnownMessageId = messages.length > 0 ? messages[messages.length - 1].id : 0;
        
        const newBotMessages = currentMessages
          .filter((msg: any) => msg.id > lastKnownMessageId && msg.message_type === 1)
          .map((msg: any) => ({
            id: msg.id,
            text: msg.content,
            sender: Sender.BOT,
          }));

        if (newBotMessages.length > 0) {
          setMessages(prev => [...prev, ...newBotMessages.sort((a,b) => a.id - b.id)]);
          stopPolling();
        }
      } catch (error) {
        console.error("Polling error:", error);
        stopPolling();
      }
    }, POLLING_INTERVAL);
  };

  const handleSendMessage = async (text: string) => {
    if (!contact) return;

    const userMessage: Message = {
      id: `local-user-${Date.now()}`,
      text,
      sender: Sender.USER,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
        if (conversationId) {
            await sendMessageToChatwoot(contact, conversationId, text);
        } else {
            // First message creates the conversation
            const { conversationId: newConvId } = await createConversation(contact, text);
            setConversationId(newConvId);
        }
        pollForReply();
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Sorry, could not send the message. Please try again.',
        sender: Sender.BOT,
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="flex-1 flex flex-col pt-20">
        <ChatHistory messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default App;
