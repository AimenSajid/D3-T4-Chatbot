import React, { useState } from 'react'
import Landing from './pages/Landing.jsx'
import Chat from './pages/Chat.jsx'

export default function App() {
  const [route, setRoute] = useState('landing')
  return (
    <div className="min-h-screen text-white font-star">
      {route === 'landing' ? (
        <Landing onStart={() => setRoute('chat')} />
      ) : (
        <Chat onBack={() => setRoute('landing')} />
      )}
    </div>
  )
}
