export type WebsocketState = 'connected' | 'connecting' | 'disconnected';

export interface WebsocketServiceOptions {
  url: string;
  autoReconnect?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

export type ListenerCallbackType = (newState: WebsocketState) => void;
export type MessageListenerCallbackType = (data: MessageDataType) => void;

export const MessageEnum = {
  SPEECH_TRANSLATION: 0,
  PONG: 1,
} as const;

export type MessageType = (typeof MessageEnum)[keyof typeof MessageEnum];

export type MessageDataType =
  | {
      type: 0;
      data: {
        text: string;
      };
    }
  | {
      type: 1;
      data: {
        text: string;
      };
    };

export type SendMessageDataType = {
  type: 0;
  data: {
    audioBase64: string;
  };
};
