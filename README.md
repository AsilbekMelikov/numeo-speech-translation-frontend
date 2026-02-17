# Numeo Project

A real-time speech translation web application that captures audio from the microphone, streams it over WebSocket to a backend service, and displays transcribed/translated text in real-time.

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** — build tool with HMR
- **Material UI (MUI) 7** — UI components
- **Tailwind CSS 4** — utility-first styling
- **React Router 7** — hash-based client-side routing
- **Web Audio API** — audio capture and processing (AudioWorklet)
- **WebSocket** — real-time communication with the backend

## Features

- Real-time audio capture via browser microphone
- Audio processing with echo cancellation and noise suppression
- Base64-encoded audio streaming over WebSocket
- Live transcription/translation display
- WebSocket connection status monitoring with auto-reconnection

## Project Structure

```
src/
├── app-types/           # Global and socket type definitions
├── components/          # Shared UI components
├── contexts/
│   └── speech-socket/   # WebSocket context provider and reducer
├── features/
│   └── speech-translation/  # Speech translation feature module
├── lib/
│   ├── constants/       # Environment configuration
│   └── utils/           # Helper utilities (audio, serialization)
├── pages/
│   ├── Dashboard.page.tsx   # Main dashboard page
│   └── layouts/             # Layout wrappers
├── router/              # Route definitions
├── services/            # WebSocket service
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_BASE_URL=vite-base-url
VITE_SOCKET_URL=vite-socket-url
```

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Path Aliases

The project uses path aliases configured in `vite.config.ts`:

| Alias          | Path              |
| -------------- | ----------------- |
| `@components`  | `src/components/` |
| `@features`    | `src/features/`   |
| `@lib`         | `src/lib/`        |
| `@pages`       | `src/pages/`      |
| `@router`      | `src/router/`     |
| `@services`    | `src/services/`   |
| `@contexts`    | `src/contexts/`   |
| `@app-types`   | `src/app-types/`  |
