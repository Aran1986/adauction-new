
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCampaignDescription = async (productName: string, targetAudience: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a professional Persian campaign description for a product named "${productName}" targeting "${targetAudience}". Include goals and tone.`
  });
  return response.text;
};

export const getNegotiationAdvice = async (
  role: string, 
  currentBudget: number, 
  campaignContext: string,
  userNiche?: string,
  refinement?: string,
  previousAdvice?: string
) => {
  const isBrand = role === 'BRAND';
  const roleTitle = isBrand ? 'Brand (Employer)' : 'Influencer (Content Creator)';
  
  let prompt = `
    You are an expert negotiation consultant for social media marketing on the AdAuction platform.
    User Role: ${roleTitle}
    Current Budget/Offer: ${currentBudget.toLocaleString()} Tomans
    Campaign Context (Industry/Niche): ${campaignContext}
    User's Specialization/Niche: ${userNiche || 'General'}

    ${refinement ? `
    The user received this previous advice from you:
    ---
    ${previousAdvice}
    ---
    Now, the user wants you to ADJUST and REFINE this advice based on the following instruction: "${refinement}".
    ` : `
    Provide 3 specific tactical negotiation points in Persian. 
    ${isBrand 
      ? "The brand wants high ROI. Focus on how the influencer's specific niche fits the brand's industry and how to negotiate for performance-based bonuses or additional assets (e.g. usage rights)." 
      : "The influencer wants to justify a higher rate. Focus on their niche authority, engagement metrics, and how their specific audience perfectly matches the brand's industry/target."
    }
    `}

    Format the response in Persian:
    1. A short, professional acknowledgment of the context/refinement.
    2. 3 detailed bullet points for the tactics.
    3. A short closing statement.
    Keep the tone professional, data-driven, and persuasive.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });
  return response.text;
};

export const generateCampaignImage = async (title: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Create a professional, high-quality, 3D style or minimalist illustration for a social media marketing campaign titled: "${title}". The campaign is described as: "${description}". Use a clean, modern aesthetic suitable for a high-end tech or lifestyle SaaS platform. Avoid any text, letters, or numbers in the image.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content) {
      throw new Error("No image generated: empty response candidates");
    }

    const parts = response.candidates[0].content.parts;
    if (!parts) {
      throw new Error("No image generated: response has no parts");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    const textOutput = response.text;
    if (textOutput) {
      console.warn("Model returned text instead of image:", textOutput);
    }
    
    throw new Error("Failed to generate image: No image data in parts");
  } catch (error) {
    console.error("Gemini Image Generation Exception:", error);
    throw error;
  }
};
