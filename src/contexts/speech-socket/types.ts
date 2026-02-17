import type { MessageDataType, SendMessageDataType, WebsocketState } from '@app-types/socket';

export interface ISpeechSocketState {
  socketState?: WebsocketState;
  lastJsonMessage?: MessageDataType;
  sendJsonMessage: (data: SendMessageDataType) => void;
}

export type ISpeechSocketAction = 'set_state';

export type ISpeechSockerAction =
  | {
      type: 'set_state';
      data: WebsocketState;
    }
  | {
      type: 'set_message';
      data: MessageDataType;
    };
