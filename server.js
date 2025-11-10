import express from 'express'
import dotenv from 'dotenv'
import cors from "cors"
import { InferenceClient } from '@huggingface/inference'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

const client = new InferenceClient(process.env.HF_TOKEN)
const systemMessages = [{
    id: 1, 
    role: "system", 
    content: "Your name is D3-T4(stands for 'Data' since you share information) and you are an expert in star wars lore. Answer the questions asked in a friendly and informative way. Make sure you complete the responses in 100 tokens." 
}]
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body
  try {
    const response = await client.chatCompletion({
      messages: [...systemMessages, ...messages],
      model: 'google/gemma-2-2b-it',
      temperature: 1.1
    })
    res.json({ reply: response.choices[0].message.content })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('Server running on port 3001'))
