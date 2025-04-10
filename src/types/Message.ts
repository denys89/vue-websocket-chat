export type MessageType = 'chat' | 'system' | 'join' | 'leave';

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  type?: MessageType;
}