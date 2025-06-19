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

  // Timetable data endpoints
  app.get("/api/timetable", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user?.id;
      const timetableData = await storage.getTimetableData(userId);
      res.json(timetableData || {});
    } catch (error) {
      console.error("Error fetching timetable data:", error);
      res.status(500).json({ message: "Failed to fetch timetable data" });
    }
  });
  
  app.post("/api/timetable", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user?.id;
      await storage.saveTimetableData(userId, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving timetable data:", error);
      res.status(500).json({ message: "Failed to save timetable data" });
    }
  });
  
  // Subject ratings endpoints
  app.get("/api/subjects/ratings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user?.id;
      const subjectRatings = await storage.getSubjectRatings(userId);
      res.json(subjectRatings || {});
    } catch (error) {
      console.error("Error fetching subject ratings:", error);
      res.status(500).json({ message: "Failed to fetch subject ratings" });
    }
  });
  
  app.post("/api/subjects/ratings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user?.id;
      await storage.saveSubjectRatings(userId, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving subject ratings:", error);
      res.status(500).json({ message: "Failed to save subject ratings" });
    }
  });
  
  // Exam settings endpoints
  app.get("/api/exams", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user?.id;
      const examSettings = await storage.getExamSettings(userId);
      res.json(examSettings || {});
    } catch (error) {
      console.error("Error fetching exam settings:", error);
      res.status(500).json({ message: "Failed to fetch exam settings" });
    }
  });
  
  app.post("/api/exams", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user?.id;
      await storage.saveExamSettings(userId, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving exam settings:", error);
      res.status(500).json({ message: "Failed to save exam settings" });
    }
  });
  
  // User performance data endpoints
  app.get("/api/performance", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user?.id;
      const performanceData = await storage.getPerformanceData(userId);
      res.json(performanceData || {});
    } catch (error) {
      console.error("Error fetching performance data:", error);
      res.status(500).json({ message: "Failed to fetch performance data" });
    }
  });
  
  app.post("/api/performance", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user?.id;
      await storage.savePerformanceData(userId, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving performance data:", error);
      res.status(500).json({ message: "Failed to save performance data" });
    }
  });

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
  
  // AI chat endpoint for event creation
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (context === 'schedule_management') {
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an AI assistant that helps medical students add events to their timetable.
Your job is to parse natural language requests for calendar events and extract structured data.

For each event mentioned in the message, extract:
1. Title - What the event is about
2. Date - When it occurs (specific date or day of week)
3. Start time - When it begins
4. End time - When it ends
5. Type - What category of event this is (personal, placement, meal, sleep, study)
6. If it's recurring - Whether this happens weekly
7. If recurring, which days of the week it occurs on

When you identify an event, format your response as a JSON object with these exact fields:
{
  "message": "Your friendly response to the user",
  "events": [
    {
      "title": "event title",
      "date": "YYYY-MM-DD",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "type": "personal|placement|meal|sleep|study",
      "recurring": true|false,
      "recurringDays": ["monday", "wednesday", "friday"] // Only if recurring is true
    }
  ]
}

Support slash commands like /lunch, /sleep to create recurring events.
If no events are mentioned, respond conversationally and set events to an empty array.
Assume all dates are in the current year unless specified otherwise.
For days of the week without a specific date, use the upcoming occurrence of that day for the date field.`
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.2,
          max_tokens: 1000,
          response_format: { type: "json_object" }
        });
        
        try {
          const responseContent = completion.choices[0]?.message?.content || "{}";
          const parsedResponse = JSON.parse(responseContent);
          
          res.json(parsedResponse);
        } catch (parseError) {
          console.error("Error parsing AI response for chat events:", parseError);
          res.json({ 
            message: "I'm having trouble understanding that. Could you try rephrasing?",
            events: []
          });
        }
      } else {
        // Generic chat response for non-schedule context
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant for medical students studying for the UKMLA exam. Provide concise, accurate responses."
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
          message: completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.",
          events: []
        });
      }
    } catch (error: any) {
      console.error("OpenAI API error in AI Chat:", error);
      
      res.json({ 
        message: "I'm sorry, I couldn't process that request right now. Please try again later.",
        events: []
      });
    }
  });

  app.post("/api/ai-reflow", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { events, preferences, userEvents } = req.body;
      
      // Format data for OpenAI
      const prompt = JSON.stringify({
        events,
        preferences,
        userEvents,
        instructions: "Optimize this medical study schedule to improve knowledge retention through spaced repetition and interleaving techniques. Consider spacing similar subjects apart, interleaving related concepts, and prioritizing difficult topics based on the student preferences. The response must be a JSON array of study blocks with the same structure as the input events."
      });
      
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an AI specialized in medical education and optimizing study schedules. 
You're tasked with taking an existing UKMLA (UK Medical Licensing Assessment) study schedule and optimizing it for better knowledge retention using principles of:

1. Spaced repetition
2. Interleaving (mixing related topics)
3. Appropriate spacing between related concepts
4. Balanced distribution of study sessions
5. Considering student preferences and constraints

When scheduling, consider:
- Priority subjects specified by the student
- Current year of medical school (1-5)
- Available weekly study hours
- Blocked time periods that can't be used (holidays, etc)
- Existing performance data, if available

Your output MUST be a JSON array of study blocks with the exact same structure as the input, but with optimized scheduling.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      });
      
      let optimizedSchedule;
      
      try {
        const responseContent = completion.choices[0]?.message?.content || "{}";
        optimizedSchedule = JSON.parse(responseContent);
        
        // Ensure we have events in the response
        if (!optimizedSchedule.events || !Array.isArray(optimizedSchedule.events)) {
          throw new Error("Invalid response format from AI");
        }
        
        res.json(optimizedSchedule);
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        
        // Fall back to the original schedule
        res.json({ 
          events,
          message: "AI optimization failed, returning original schedule"
        });
      }
    } catch (error: any) {
      console.error("OpenAI API error in AI Reflow:", error);
      
      // Return the original events as fallback
      res.json({ 
        events: req.body.events,
        message: "AI reflow encountered an error. Using original schedule."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}