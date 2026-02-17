import {
  type MessageDataType,
  type ListenerCallbackType,
  type MessageListenerCallbackType,
  type WebsocketServiceOptions,
  type WebsocketState,
  type SendMessageDataType,
} from '@app-types/socket';
import { deserializeMessageData, serializeMessageData } from '@lib/utils/common';

export class WebsocketService {
  private ws?: WebSocket;
  private options: Required<WebsocketServiceOptions>;
  private state?: WebsocketState;
  private reconnectionAttempts = 0;
  private stateListeners: ListenerCallbackType[] = [];
  private messageListeners: MessageListenerCallbackType[] = [];

  constructor(options: WebsocketServiceOptions) {
    this.options = {
      autoReconnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5_000,
      ...options,
    };
  }

  connect() {
    console.log('this options', this.options);
    this.ws = new WebSocket(this.options.url);

    this.setState('connecting');

    this.ws.onclose = event => {
      console.log('closing the websocket', event);

      if (event.code !== 1000) {
        this.reconnect();
      } else {
        this.disconnect();
      }
    };

    this.ws.onerror = event => {
      console.log(`event error, `, event);
    };

    this.ws.onopen = event => {
      this.reconnectionAttempts = 0;
      console.log('opening the connection', event);

      this.setState('connected');
    };

    this.ws.onmessage = event => {
      const deserializedData = deserializeMessageData(event.data);
      if (deserializedData) {
        this.handleMessageData(deserializedData);
      }
    };
  }

  sendToBackend(data: SendMessageDataType) {
    const serializedData = serializeMessageData(data);
    if (serializedData) {
      this.ws?.send(serializedData);
    }
  }

  disconnect() {
    this.setState('disconnected');
    this.ws?.close(1000, 'i am antentionally closing');
    this.stateListeners = [];
  }

  reconnect() {
    if (this.reconnectionAttempts < this.options.reconnectionAttempts) {
      this.setState('connecting');
      // jitter -- probability,
      const delay = this.options.reconnectionDelay + Math.random() * 1_000;
      this.reconnectionAttempts++;
      setTimeout(() => this.connect(), delay);
    } else {
      this.setState('disconnected');
    }
  }

  listener(callback: ListenerCallbackType) {
    this.stateListeners.push(callback);
  }

  messageListener(callback: MessageListenerCallbackType) {
    this.messageListeners.push(callback);
  }

  setState(newState: WebsocketState) {
    if (newState === this.state) return;
    this.state = newState;

    // for realtime update of state
    if (this.stateListeners.length > 0) {
      for (const stateListener of this.stateListeners) {
        stateListener(newState);
      }
    }
  }

  handleMessageData(data: MessageDataType) {
    if (this.messageListeners.length > 0) {
      for (const messageListener of this.messageListeners) {
        messageListener(data);
      }
    }
  }

  getState() {
    return this.state;
  }
}
