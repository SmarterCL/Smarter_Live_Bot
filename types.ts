
export enum Sender {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  id: string | number;
  text: string;
  sender: Sender;
}
