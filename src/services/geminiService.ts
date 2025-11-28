import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult, ExtractedData } from "@/types";

// Initialize Gemini API
// Ensure you have NEXT_PUBLIC_GEMINI_API_KEY in your .env.local
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function analyzeRealEstateAd(adContent: string): Promise<AnalysisResult> {
    // TODO: Implement actual Gemini call with gemini-2.0-flash
    console.log("Analyzing ad content:", adContent);

    // Mock response for now
    return {
        urgencyScore: 75,
        urgencyReasoning: "Mot-clés 'urgent', 'cause départ' détectés.",
        suggestedOutreach: {
            sms: "Bonjour, j'ai vu votre bien...",
            emailSubject: "Intérêt pour votre appartement",
            emailBody: "Madame, Monsieur...",
        },
    };
}

export async function processRealEstateDocument(file: Blob): Promise<ExtractedData> {
    // TODO: Implement actual Gemini call with gemini-1.5-pro-vision
    console.log("Processing document:", file.size);

    // Mock response for now
    return {
        surface: 65,
        energyClass: "D",
    };
}
