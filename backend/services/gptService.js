import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function askGPT(message) {
    try {
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful chatbot for a website. Respond concisely." },
                { role: "user", content: message },
            ],
            max_tokens: 80,
        });

        return completion.choices[0].message.content;
    } catch (err) {
        console.error("GPT Error:", err);
        return "I couldn’t process that request right now.";
    }
}
