import { GoogleGenAI } from "@google/genai";
import { SearchResult, SearchSource } from '../types';

export const performSearch = async (query: string): Promise<SearchResult> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    // 1. Perform Text Search with Grounding
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Perform a comprehensive search for: "${query}". 
              
              Guidelines:
              1. Provide a clear, detailed summary of the answer using Markdown formatting.
              2. Use bolding for key terms.
              3. Ensure the tone is professional yet accessible.
              4. Do not generate any diagrams or code blocks for visualization.`
            }
          ]
        }
      ],
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const fullText = response.text || "No results found.";
    
    // Extract Grounding Metadata (Sources)
    const sources: SearchSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    return {
      query,
      text: fullText,
      sources: sources,
      timestamp: Date.now()
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
