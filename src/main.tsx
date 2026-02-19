import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import GlobalStyles from '@mui/material/GlobalStyles';
import { StyledEngineProvider } from '@mui/material/styles';
import { SpeechSocketProvider } from '@contexts/speech-socket/SpeechSocket.context.tsx';
import { Analytics } from '@vercel/analytics/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <SpeechSocketProvider>
        <App />
        <Analytics />
      </SpeechSocketProvider>
    </StyledEngineProvider>
  </StrictMode>
);
