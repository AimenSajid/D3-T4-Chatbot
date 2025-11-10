export default function MessageBubble({ role, content }) {
  const isAssisstant = role === 'assistant'
  return (
    <div className={`flex ${isAssisstant ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-4 leading-relaxed
        ${isAssisstant
          ? 'bg-cyan-400/5 border border-holo text-holo shadow-holo'
          : 'bg-emerald-400/5 border border-saber-green text-saber-green shadow-saber-green'
        } holo-shimmer`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}
