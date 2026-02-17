import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import type { ISpeechSocketState } from './types';
import { socketReducer } from './socketReducer';
import { WebsocketService } from '@services/websocket.service';
import { envData } from '@lib/constants/envConfig.constant';
import type { SendMessageDataType, WebsocketServiceOptions } from '@app-types/socket';

const initialSocketState: ISpeechSocketState = {
  socketState: undefined,
  lastJsonMessage: undefined,
  sendJsonMessage: () => {},
};

const SpeechSocketContext = createContext<ISpeechSocketState>(initialSocketState);

interface Props {
  children: React.ReactNode;
}
export const SpeechSocketProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(socketReducer, initialSocketState);

  const sendBackendRef = useRef<ISpeechSocketState['sendJsonMessage']>(null);

  const sendMessageViaSocket = useCallback((data: SendMessageDataType) => {
    if (!sendBackendRef || !sendBackendRef.current) return;
    sendBackendRef.current?.(data);
  }, []);

  useEffect(() => {
    const socketOptions: WebsocketServiceOptions = {
      url: envData.SOCKET_URL + '/ws',
    };
    const socketInstance = new WebsocketService(socketOptions);

    socketInstance.connect();
    socketInstance.listener(newState => dispatch({ type: 'set_state', data: newState }));
    socketInstance.messageListener(data => dispatch({ type: 'set_message', data }));

    sendBackendRef.current = (data: SendMessageDataType) => socketInstance.sendToBackend(data);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const value = useMemo(
    () => ({ ...state, sendJsonMessage: sendMessageViaSocket }),
    [state, sendMessageViaSocket]
  );

  return <SpeechSocketContext.Provider value={value}>{children}</SpeechSocketContext.Provider>;
};

export const useWebsocket = () => {
  const context = useContext(SpeechSocketContext);
  if (!context) {
    throw new Error('You can use the socket state inside context provider');
  }
  return context;
};
