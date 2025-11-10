import React from 'react'

export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <h1 className="text-holo text-4xl md:text-7xl font-extrabold tracking-wide text-center">
        D3-T4
      </h1>

      <div className="screen-text mt-10 w-full max-w-3xl">
        <div className="screen-text flex items-center text-center text-lg leading-8 px-6">
          <p className="mt-6 opacity-90">
            Question, you have? Answers, I do --with 87% more flair than Master Yoda.
          </p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="mt-14 px-8 py-4 rounded-2xl border border-holo shadow-holo hover:shadow-saber-blue transition uppercase tracking-widest text-holo font-semibold holo-shimmer"
      >
        Start Chatting
      </button>
    </div>
  )
}
