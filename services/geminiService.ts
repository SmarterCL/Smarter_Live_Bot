
// This service handles communication with the Chatwoot API.
// IMPORTANT: Replace the placeholder values below with your Chatwoot instance details.

// The base URL of your self-hosted Chatwoot instance.
// Example: 'https://chatwoot.smarterbot.cl'
const CHATWOOT_API_URL = 'YOUR_CHATWOOT_INSTANCE_URL'; 

// The public identifier of the inbox you want to connect to.
// You can find this in your Chatwoot inbox settings.
const CHATWOOT_INBOX_ID = 'YOUR_CHATWOOT_INBOX_IDENTIFIER';

interface ChatwootContact {
  id: number;
  source_id: string;
  pubsub_token: string;
}

interface ChatwootMessage {
  id: number;
  content: string;
  message_type: number; // 0 for incoming (user), 1 for outgoing (bot/agent)
  sender?: {
    type: string; // 'user' or 'agent'
  }
}

// --- Local Storage Management ---
const getContactFromStorage = (): ChatwootContact | null => {
  const contact = localStorage.getItem('chatwoot_contact');
  return contact ? JSON.parse(contact) : null;
};

const setContactInStorage = (contact: ChatwootContact) => {
  localStorage.setItem('chatwoot_contact', JSON.stringify(contact));
};

const getConversationIdFromStorage = (): number | null => {
  const convId = localStorage.getItem('chatwoot_conversation_id');
  return convId ? parseInt(convId, 10) : null;
};

const setConversationIdInStorage = (id: number) => {
  localStorage.setItem('chatwoot_conversation_id', String(id));
}

// --- API Functions ---

// Finds an existing contact in local storage or creates a new one via the API.
export const findOrCreateContact = async (): Promise<ChatwootContact> => {
  let contact = getContactFromStorage();
  if (contact) {
    return contact;
  }

  const response = await fetch(`${CHATWOOT_API_URL}/api/v1/inboxes/${CHATWOOT_INBOX_ID}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error('Failed to create Chatwoot contact');
  }

  contact = await response.json();
  setContactInStorage(contact);
  return contact;
};

// Sends a message to a conversation.
export const sendMessageToChatwoot = async (contact: ChatwootContact, conversationId: number, message: string): Promise<ChatwootMessage> => {
    const response = await fetch(`${CHATWOOT_API_URL}/api/v1/inboxes/${CHATWOOT_INBOX_ID}/contacts/${contact.source_id}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });

    if (!response.ok) {
        throw new Error('Failed to send message to Chatwoot');
    }
    
    return await response.json();
};

// Gets all messages for a conversation.
export const getConversationMessages = async (contact: ChatwootContact): Promise<{messages: ChatwootMessage[], conversationId: number}> => {
  const response = await fetch(`${CHATWOOT_API_URL}/api/v1/inboxes/${CHATWOOT_INBOX_ID}/contacts/${contact.source_id}/conversations`);
  
  if (!response.ok) {
    throw new Error('Failed to get conversation from Chatwoot');
  }

  const conversations = await response.json();
  if (conversations.payload && conversations.payload.length > 0) {
    const conversationId = conversations.payload[0].id;
    setConversationIdInStorage(conversationId);
    return { messages: conversations.payload[0].messages, conversationId };
  }
  
  // No conversation yet, we'll create one with the first message.
  return { messages: [], conversationId: -1 };
};

// Creates the first message, which also creates the conversation.
export const createConversation = async (contact: ChatwootContact, message: string): Promise<{messages: ChatwootMessage[], conversationId: number}> => {
  const response = await fetch(`${CHATWOOT_API_URL}/api/v1/inboxes/${CHATWOOT_INBOX_ID}/contacts/${contact.source_id}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: { content: message } }),
    });

    if (!response.ok) {
        throw new Error('Failed to create conversation');
    }
    const data = await response.json();
    const conversationId = data.id;
    setConversationIdInStorage(conversationId);
    return { messages: data.messages, conversationId };
}
