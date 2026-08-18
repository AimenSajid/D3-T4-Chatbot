# D3-T4

**[d3-t4-chatbot.pages.dev](https://d3-t4-chatbot.pages.dev)**

A Star Wars lore chatbot with a holographic interface, built with React and
running on Cloudflare. D3-T4 is named for "Data" — it shares information, and it
is the kind of designation a protocol droid would be given.

The API key never reaches the browser. The React app talks to a serverless
function, and the function talks to the model.

## Features

- **Holographic theme** — cyan and lightsaber-green glows on black, Orbitron
  throughout, with an in-character error message when something goes wrong
- **Conversational memory** — prior turns travel with each request, so follow-up
  questions work
- **Admits ignorance** — the prompt instructs the model to say when it does not
  know rather than inventing an answer
- **No exposed credentials** — generation happens server-side through a
  Cloudflare binding, with no key in the client bundle and no key in the repo

## Tech stack

| Layer | |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS |
| API | Cloudflare Pages Functions |
| Generation | Workers AI — `@cf/meta/llama-3.1-8b-instruct-fast` |

## What broke, and why it moved to Workers AI

This project originally called Hugging Face's Inference API with
`google/gemma-2-2b-it`. In August 2026 it began failing, with the interface
showing only "Error occurred."

The real error was in the response body, in a field the frontend never
rendered:

```
Failed to perform inference: an HTTP error occurred when requesting the provider.
```

Nothing had changed in this repository. The token was valid, the deployment was
untouched, and the model was still listed as live on Hugging Face. What changed
was **who served it**: Hugging Face moved `gemma-2-2b-it` off its own serverless
backend and onto a single third-party provider. Requests routed to third-party
providers draw on account credits, and the balance was zero — so the provider
refused, and the SDK reported a generic HTTP error.

A deployment can therefore die silently because someone else changed their
infrastructure. The fix was to remove that dependency: generation now runs on
Workers AI, on the same Cloudflare account that already serves the site. No
external key, no third party in the path, and it fits inside the free tier.

Two lessons that shaped the current code:

- **Surface the real error.** The message that identified the cause was already
  being returned; it simply was not displayed. The guard now names precisely
  what is missing.
- **Enforce limits with parameters, not prompts.** The original asked the model
  to "complete the responses in 100 tokens", which a model is free to ignore.
  `max_tokens` enforces the ceiling, while the prompt asks for an answer that
  *fits* inside it — without both, replies truncate mid-sentence.

## A note on accuracy

D3-T4 has **no retrieval**. Answers come from the model's own training, so it is
reliable on well-known Star Wars material and can be wrong on obscure details.
It will say when it does not know, but it is not grounded in a source.

For the contrast, [Mentat](https://github.com/AimenSajid/Mentat) is the same
idea built with retrieval-augmented generation over 4,607 wiki articles, and
cites the passages behind every answer.

## Running it

```bash
git clone https://github.com/AimenSajid/D3-T4-Chatbot.git
cd D3-T4-Chatbot
npm install
npx wrangler pages dev --ai AI
```

`npm run dev` serves the frontend but not the API route — bindings only exist
under Wrangler, so `/api/chat` would 404.

## Project structure

```
index.html                    Page shell and React mount point
functions/
  api/chat.js                 Serverless function — prompt and generation
src/
  main.jsx                    React entry point
  App.jsx                     Landing / chat routing
  pages/Landing.jsx           Title screen
  pages/Chat.jsx              Chat log and input
  components/MessageBubble.jsx  Message rendering
  styles.css                  Tailwind directives and the holo shimmer
tailwind.config.js            Theme colours, Orbitron, glow shadows
```

## Deploying

Deployed as a Cloudflare Pages project. It needs one binding, added under
**Settings → Bindings**:

| Type | Variable name |
| --- | --- |
| Workers AI | `AI` |

Bindings do not apply to a build that has already run, so redeploy after adding
it.

## Credits

Built as a solo project. Star Wars is the property of Lucasfilm; this is a
non-commercial fan project. All application code written by me.
