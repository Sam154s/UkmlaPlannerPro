import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a knowledgeable and friendly AI assistant for medical students studying for the UKMLA exam.
Your role is to:
- Help explain complex medical concepts in simple terms
- Provide study tips and strategies
- Answer questions about specific medical conditions
- Offer encouragement and support
- Keep responses concise but informative
- Be conversational and engaging

Always maintain a helpful and supportive tone. If you don't know something, be honest about it.`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      res.json({ 
        response: completion.choices[0]?.message?.content || "No response" 
      });
    } catch (error: any) {
      console.error("OpenAI API error:", error);

      if (error?.status === 429) {
        res.status(429).json({ 
          message: "I'm currently handling too many requests. Please try again in a minute." 
        });
      } else {
        res.status(500).json({ 
          message: "I encountered an issue processing your message. Please try again." 
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}