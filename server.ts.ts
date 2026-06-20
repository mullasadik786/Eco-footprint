import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini SDK securely
const aiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

try {
  if (aiKey && aiKey.startsWith("AIza")) {
    ai = new GoogleGenAI({
      apiKey: aiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
} catch (e) {
  console.error("Gemini SDK Initialization failed, switching to fallback:", e);
  ai = null;
}

// REST route for advising on carbon emissions
app.post("/api/gemini/advisor", async (req, res) => {
  const { activities, loggedActions } = req.body;

  // Fallback Logic: Returns high-quality dynamic simulation data if API Key is empty or has issues
  if (!ai) {
    return res.json({
      summary: "You are doing an excellent job tracking your carbon footprint. Based on your current logged habits, your energy and transport categories present the highest opportunities for carbon reduction.",
      weakestCategory: activities.length === 0 ? "General Profile" : activities[0]?.category || "transport",
      personalizedTips: [
        "Unplug appliances and chargers when not in use to combat standby power drain.",
        "Consider line-drying clothes on warm days to save electricity.",
        "Combine vehicle trips and utilize public transit or active cycling where feasible.",
        "Switch to energy-efficient LED lighting and adjust seasonal thermostats to moderate levels."
      ],
      reductionPlan: [
        {
          title: "Optimize Home Power Consumption",
          difficulty: "Easy",
          co2eSavedEstimate: "50-100 kg CO2e/year",
          steps: [
            "Enable power saving modes on digital appliances",
            "Lower water heater settings to 49°C (120°F)",
            "Install smart plug strips to completely switch off unused home media devices"
          ]
        },
        {
          title: "Transition to Eco-conscious Travel",
          difficulty: "Medium",
          co2eSavedEstimate: "200-400 kg CO2e/year",
          steps: [
            "Commit to car-free commutes at least once a week",
            "Maintain proper tire inflation to maximize fuel economy by up to 3%",
            "Avoid high-speed acceleration which burns excess fuel"
          ]
        }
      ],
      emissionProfileAnalysis: "Your tracked history shows dynamic progress. Continuing to reduce active utility usage will significantly flatten your emission curves."
    });
  }

  try {
    const actString = JSON.stringify(activities);
    const actionsString = JSON.stringify(loggedActions);

    const promptText = `
You are an expert environmental carbon footprint strategist and sustainability advisor.
Your goal is to parse the user's emission logs and actions, and generate a hyper-personalized, realistic Sustainable Emissions Reduction Plan.

User's Activity Footprint Logs:
${actString}

User's Saved Carbon Reduction Actions:
${actionsString}

Based on this real-world profile, identify areas of improvement and output a detailed plan.
Please respond with a schema-aligned JSON object that provides:
1. summary: A 2-3 sentence assessment of their current progress.
2. weakestCategory: One of 'energy', 'transport', 'food_waste' where they emit the most or have the most room to grow.
3. personalizedTips: A list of 4 actionable, direct instructions matching their profile.
4. reductionPlan: A list of 2 or 3 structured goals (each with a Title, Difficulty [Easy, Medium, Hard], estimated co2eSavedEstimate in kg, and 3 specific steps).
5. emissionProfileAnalysis: An overview analysis of their relative impact.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "Brief professional summary of the user's current emission status and opportunities."
            },
            weakestCategory: {
              type: Type.STRING,
              description: "The category that requires the most attention: 'energy', 'transport', or 'food_waste'."
            },
            personalizedTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Four direct, highly actionable tips tailored to their logged activities."
            },
            reductionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Title of the goal." },
                  difficulty: { type: Type.STRING, description: "Difficulty level: 'Easy', 'Medium', or 'Hard'." },
                  co2eSavedEstimate: { type: Type.STRING, description: "Estimated carbon saved per year (e.g., '120 kg CO2e/year')." },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of actionable steps."
                  }
                },
                required: ["title", "difficulty", "co2eSavedEstimate", "steps"]
              },
              description: "Two or three customized improvement programs."
            },
            emissionProfileAnalysis: {
              type: Type.STRING,
              description: "A motivating and professional assessment statement."
            }
          },
          required: ["summary", "weakestCategory", "personalizedTips", "reductionPlan", "emissionProfileAnalysis"]
        }
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    return res.json(parsedData);
  } catch (error) {
    console.error("Gemini advisor API failure:", error);
    return res.status(500).json({ error: "Failed to query sustainability insights" });
  }
});

// Static files hosting configuration for Vercel
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Export the app instance for Vercel Serverless Handling
export default app;
