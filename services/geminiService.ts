import { GoogleGenAI, Type } from "@google/genai";

let genAI: GoogleGenAI | null = null;

export const initializeGemini = () => {
  if (process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
};

export const generateProgramGuide = async (channelName: string, category: string): Promise<{ title: string; synopsis: string }> => {
  if (!genAI) {
    initializeGemini();
  }
  
  if (!genAI) {
    return {
      title: "Unknown Signal",
      synopsis: "Signal encryption prevents program data retrieval. Please adjust antenna."
    };
  }

  try {
    const timeOfDay = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const prompt = `
      You are a retro TV Guide writer from the 1990s. 
      Generate a fictional or semi-realistic program listing for a channel called "${channelName}" (Category: ${category}) playing at ${timeOfDay}.
      
      Return valid JSON with:
      - title: A catchy, retro-sounding show title.
      - synopsis: A 2-sentence description, dramatic or witty, in the style of a 90s TV listing.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            synopsis: { type: Type.STRING },
          },
          required: ["title", "synopsis"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini Guide Error:", error);
    return {
      title: "Transmission Error",
      synopsis: "Program information unavailable due to atmospheric interference."
    };
  }
};
