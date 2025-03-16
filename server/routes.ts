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
            content: "You are a helpful AI assistant for UKMLA revision. Help users understand medical concepts and create study plans."
          },
          {
            role: "user",
            content: message
          }
        ],
      });

      res.json({ 
        response: completion.choices[0]?.message?.content || "No response" 
      });
    } catch (error: any) {
      console.error("OpenAI API error:", error);

      // Check if it's a rate limit error
      if (error?.status === 429) {
        res.status(429).json({ 
          error: "The AI service is currently at capacity. Please try again in a few minutes." 
        });
      } else {
        res.status(500).json({ 
          error: "There was an issue connecting to the AI service. Please try again." 
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}