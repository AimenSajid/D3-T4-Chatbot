import { InferenceClient } from "@huggingface/inference"

export async function onRequestPost(context) {
    const { request, env } = context

    try{
        const body = await request.json()
        const messages = body.messages || []

        const client = new InferenceClient(env.HF_TOKEN)

        const systemMessages = [{
            id: 1, 
            role: "system", 
            content: "Your name is D3-T4(stands for 'Data' since you share information) and you are an expert in star wars lore. Answer the questions asked in a friendly and informative way. Make sure you complete the responses in 100 tokens." 
        }]

        const response = await client.chatCompletion({
            messages: [...systemMessages, ...messages],
            model: 'google/gemma-2-2b-it',
            temperature: 1.1
        })

        const reply = response.choices?.[0]?.message?.content || "Error 66: The system has turned against us. Please Retry"

        return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    })
    } catch (err) {
        console.error("Chat function error:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }

}