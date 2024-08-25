import {OpenAI} from "openai";
import  configDotenv from "dotenv";
configDotenv.config();

console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);  // Should print your API key or undefined

if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API Key in environment variables");
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function draftContract(employerTerms: string): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
             messages: [
                 {
                     role: "system",
                     content: "You are a helpful assistant that drafts a contract based on the employer's terms.",
                 },
                 {
                     role: "user",
                     content: `Draft a contract based on the following employer terms: ${employerTerms}`,
                 },
             ],
         });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error drafting contract:", error);
        throw new Error("Failed to draft contract");
    }
}