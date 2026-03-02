import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GameProvider } from './context/GameContext.tsx'
import { PlayerProvider } from './context/PlayerContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlayerProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </PlayerProvider>
  </StrictMode>,
)
