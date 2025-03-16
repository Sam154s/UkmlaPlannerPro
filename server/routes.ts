import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fallback responses for rate limit scenarios
const fallbackResponses = [
  "I understand you asked about {topic}. While I'm currently experiencing high traffic, let me share what I know about UKMLA studies. What specific aspect would you like to focus on?",
  "I noticed your interest in {topic}. I'm a bit busy right now, but I'd love to help you with your UKMLA studies. Could you rephrase your question?",
  "While I process your question about {topic}, let me ask: what's your biggest challenge in UKMLA preparation?",
];

function getFallbackResponse(message: string): string {
  const topics = ["medical", "study", "exam", "UKMLA", "revision"];
  let topic = topics.find(t => message.toLowerCase().includes(t.toLowerCase())) || "that";
  const response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  return response.replace("{topic}", topic);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

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
        res.json({ 
          response: getFallbackResponse(req.body.message)
        });
      } else if (error?.status === 401) {
        res.status(500).json({ 
          message: "I'm having trouble accessing my knowledge base. Please try again in a moment."
        });
      } else {
        res.json({ 
          response: "I understand your question, but I'm having a brief moment of confusion. Could you rephrase that for me?"
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}