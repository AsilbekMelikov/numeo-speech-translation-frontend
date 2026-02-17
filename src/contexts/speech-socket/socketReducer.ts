import type { ISpeechSockerAction, ISpeechSocketState } from './types';

export const socketReducer = (state: ISpeechSocketState, payload: ISpeechSockerAction) => {
  switch (payload.type) {
    case 'set_state':
      return { ...state, socketState: payload.data };
    case 'set_message':
      return { ...state, lastJsonMessage: payload.data };
    default:
      return state;
  }
};
