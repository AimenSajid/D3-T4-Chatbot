import React, { useEffect, useRef, useState } from 'react'
import MessageBubble from '../components/MessageBubble.jsx'


async function chatReply(chatHistory) {
  
  const response = await getReply(chatHistory)
  return response
}

export default function Chat({ onBack }) {
  const [chatHistory, setChatHistory] = useState([
    { id: 2, role: 'assistant', content: 'Hey there, traveler! D3-T4 reporting for duty. Got a question about the galaxy far, far away? Fire away, and I’ll fetch the data faster than a hyperdrive jump!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [chatHistory, loading])

async function sendMessage() {
    const userInput = input.trim()
    if (!userInput || loading) return
    setInput('')
    const userMsg = { id: Date.now(), role: 'user', content:userInput }
    const newChatHistory = [...chatHistory, userMsg]
    setChatHistory(newChatHistory)
    setLoading(true)
    try {
      const response = await fetch("/api/chat",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
        messages: newChatHistory
      })
      })
      const data = await response.json()
      const replyText = data.reply
      setChatHistory(prev => [
        ...prev, 
        { id: Date.now(), role: 'assistant', content:replyText}])
    } catch(error){
      console.error(error)
      return "Sorry, Somthing went wrong!"
    } finally {
    setLoading(false)
}
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-holo/30 bg-black">
        <button onClick={onBack} className="text-sm px-4 py-2 border border-holo rounded-xl hover:shadow-saber-blue transition">
          ← Back
        </button>
        <span className="text-holo font-semibold">D3-T4</span>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {chatHistory.map(m => (
            <MessageBubble key={m.id} role={m.role} content={m.content} />
          ))}
          {loading && (
            <div className="text-holo/80 text-sm italic">Accessing archives…</div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 bg-black border-t border-holo/30">
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Ask about characters, planets, ships…"
            className="flex-1 resize-none rounded-2xl p-4 bg-black/60 border border-holo focus:outline-none focus:border-holo text-white placeholder-white/40"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-6 py-3 rounded-2xl border border-holo text-holo font-semibold shadow-saber-blue hover:shadow-saber-green transition"
          >
            Send
          </button>
        </div>
        <p className="max-w-3xl mx-auto mt-2 text-xs text-white/60">Press Enter to send</p>
      </div>
    </div>
  )
}
