
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCampaignDescription = async (productName: string, targetAudience: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a professional Persian campaign description for a product named "${productName}" targeting "${targetAudience}". Include goals and tone.`
  });
  return response.text;
};

export const getNegotiationAdvice = async (role: string, currentBudget: number, campaignContext: string) => {
  const isBrand = role === 'BRAND';
  const roleTitle = isBrand ? 'Brand (Employer)' : 'Influencer (Content Creator)';
  
  const prompt = `
    You are an expert negotiation consultant for social media marketing.
    User Role: ${roleTitle}
    Current Budget/Offer: ${currentBudget.toLocaleString()} Tomans
    Context: ${campaignContext}

    ${isBrand 
      ? "The brand wants to ensure high ROI while keeping costs within budget. Provide 3 specific tactical negotiation points in Persian to help the brand negotiate a better deal or more value (e.g., extra stories, longer post life) from the influencer." 
      : "The influencer wants to maximize their earnings while maintaining a good relationship with the brand. Provide 3 specific tactical negotiation points in Persian to help the influencer justify a higher rate or better terms based on their value."
    }
    
    Format the response with a short encouraging intro, then bullet points for the 3 tactics, and a professional closing. Use a professional, persuasive, and polite Persian tone.
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

    // Check if we have candidates and content
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

    // If we got text back instead of an image, log it and throw
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
