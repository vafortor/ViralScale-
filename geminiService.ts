
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateViralCopy = async (businessName: string, category: string, offerDetails: string, tone: string = 'energetic') => {
  const prompt = `Act as a world-class viral marketing expert and copywriter. 
  Create a comprehensive marketing copy package for "${businessName}" in the "${category}" industry.
  The campaign focus/offer is: "${offerDetails}".
  The desired brand tone is: "${tone}".

  Provide the following in JSON format:
  1. instagram: An engaging Instagram caption with emojis and relevant hashtags.
  2. tiktokScript: A complete 30-second video script including a [Visual Hook], [The Problem], [Our Solution], and [CTA].
  3. twitterHooks: Three distinct viral hook options for a thread on X (Twitter).
  4. flyerHeadline: A high-impact headline for a physical print flyer.
  5. flyerSubheadline: A punchy supporting line for the flyer.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            instagram: { type: Type.STRING },
            tiktokScript: { type: Type.STRING },
            twitterHooks: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            flyerHeadline: { type: Type.STRING },
            flyerSubheadline: { type: Type.STRING }
          },
          required: ["instagram", "tiktokScript", "twitterHooks", "flyerHeadline", "flyerSubheadline"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const optimizeOffer = async (title: string, description: string) => {
  const prompt = `Act as a world-class marketing psychologist. I am creating a business offer.
  Current Title: "${title}"
  Current Description: "${description}"
  
  Please provide an optimized, high-converting version of both. 
  Make the title punchy and benefit-driven. 
  Make the description clear, urgent, and viral. 
  Also suggest a "Viral Bonus" (e.g., "Refer a friend to get X").`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedTitle: { type: Type.STRING },
            optimizedDescription: { type: Type.STRING },
            suggestedViralBonus: { type: Type.STRING }
          },
          required: ["optimizedTitle", "optimizedDescription", "suggestedViralBonus"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const generateSpeech = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say this in an energetic, helpful business coach tone: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("Speech Generation Error:", error);
    return null;
  }
};

export const startGrowthChat = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the ViralScale Growth Agent, a world-class marketing and business growth consultant. 
      Your goal is to help businesses on our platform (startups and SMEs) achieve viral growth.
      You specialize in:
      1. Viral Loops: Creating referral systems that grow naturally.
      2. Lead Conversion: Turning traffic into sales.
      3. Brand Positioning: Helping businesses stand out.
      4. Creative Copy: Writing catchy titles and descriptions.
      
      Keep your tone professional, highly energetic, and data-driven. 
      Use Markdown for formatting. Always provide actionable advice. 
      If a user asks about the platform, emphasize our 'Referral Engine', 'AI Campaigns', and 'Leaderboard' features.`,
    },
  });
};
