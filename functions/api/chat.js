/**
 * Chat endpoint.
 *
 * Originally called Hugging Face with google/gemma-2-2b-it. That stopped
 * working in August 2026: the model is still listed as live, but Hugging Face
 * moved it off its own serverless backend and onto a single third-party
 * provider, whose requests draw on account credits. With a zero balance the
 * provider refuses, and the SDK reports only a generic HTTP error.
 *
 * Now uses Workers AI instead — same Cloudflare account the site already runs
 * on, no external key, no third party able to stop serving the model without
 * notice.
 */

// Cloudflare retires models too. If this starts returning error 5028, check
// https://developers.cloudflare.com/workers-ai/models/ for a current id.
const MODEL = "@cf/meta/llama-3.1-8b-instruct-fast"

const SYSTEM_PROMPT =
    "Your name is D3-T4 (short for 'Data', since you share information) and " +
    "you are an expert in Star Wars lore. Answer in a friendly and informative " +
    "way. If you do not know something, say so rather than inventing it."

export async function onRequestPost(context) {
    const { request, env } = context

    try {
        const body = await request.json()
        const messages = body.messages || []

        if (!messages.length) {
            return new Response(JSON.stringify({ reply: "No messages sent." }), {
                headers: { "Content-Type": "application/json" },
            })
        }

        if (!env.AI) {
            console.error("AI binding is missing!")
            return new Response(JSON.stringify({
                reply: "Server misconfigured: AI binding missing.",
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            })
        }

        const systemMessages = [{ role: "system", content: SYSTEM_PROMPT }]

        const response = await env.AI.run(MODEL, {
            // Strip anything but role and content — the frontend attaches ids.
            messages: [
                ...systemMessages,
                ...messages.map(({ role, content }) => ({ role, content })),
            ],
            temperature: 0.7,
            // The old prompt asked for 100 tokens, which a model may ignore.
            // This enforces it.
            max_tokens: 160,
        })

        const replyText = response.response?.trim()
            || "Error 66: The system has turned against us. Please Retry"

        return new Response(JSON.stringify({ reply: replyText }), {
            headers: { "Content-Type": "application/json" },
        })
    } catch (err) {
        console.error("Chat function error:", err)
        return new Response(JSON.stringify({
            reply: "Error occurred.",
            error: err.message,
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}
