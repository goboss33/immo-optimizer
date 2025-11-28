import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult, ExtractedData } from "@/types";

// Initialize Gemini API
// Ensure you have NEXT_PUBLIC_GEMINI_API_KEY in your .env.local
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function analyzeRealEstateAd(adContent: string): Promise<AnalysisResult> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `
    Tu es un Chasseur Immobilier d'Élite, expert en détection d'opportunités "Off-Market" et en négociation.
    Ta mission : Analyser cette annonce immobilière et déterminer si c'est une opportunité en or (Urgence, Sous-évalué, Potentiel).

    Analyse les indices subtils :
    - Mots-clés d'urgence : "Divorce", "Succession", "Départ étranger", "Travaux à prévoir", "Offre étudiée".
    - Incohérences prix/surface.
    - Qualité de l'annonce (Photos moches + Bon quartier = Opportunité).

    Tu dois retourner un JSON STRICT correspondant à cette structure TypeScript :
    interface AnalysisResult {
        urgencyScore: number; // 0 à 100. 100 = Super Hot/Urgent.
        urgencyReasoning: string; // Explication courte et percutante (max 1 phrase).
        suggestedOutreach: {
            sms: string; // SMS pro, court, direct, pour obtenir une visite.
            emailSubject: string; // Objet accrocheur.
            emailBody: string; // Email professionnel demandant dossier ou visite.
        };
    }

    Réponds UNIQUEMENT avec le JSON. Pas de markdown, pas de texte avant/après.
    `;

    try {
        const result = await model.generateContent([systemPrompt, `Annonce à analyser : ${adContent}`]);
        const response = result.response;
        const text = response.text();

        // Clean up markdown if present (Gemini sometimes adds \`\`\`json ... \`\`\`)
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const analysis: AnalysisResult = JSON.parse(jsonString);
        return analysis;
    } catch (error) {
        console.error("Error analyzing ad with Gemini:", error);
        // Fallback in case of error
        return {
            urgencyScore: 0,
            urgencyReasoning: "Erreur lors de l'analyse IA.",
            suggestedOutreach: {
                sms: "Erreur",
                emailSubject: "Erreur",
                emailBody: "Erreur"
            }
        };
    }
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
