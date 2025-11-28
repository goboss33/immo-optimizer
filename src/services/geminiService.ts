import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult, ExtractedData } from "@/types";

// Initialize Gemini API
// Ensure you have NEXT_PUBLIC_GEMINI_API_KEY in your .env.local
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function analyzeRealEstateAd(adContent: string): Promise<AnalysisResult> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

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

// Helper to convert File to Base64
async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64Data = base64String.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function processDocument(file: File): Promise<ExtractedData> {
    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

    const systemPrompt = `
    Tu es un assistant administratif notaire expert.
    Ta mission : Extraire les données clés de ce document immobilier (PDF ou Image).

    Identifie le TYPE de document parmi : 'DPE', 'TITRE_PROPRIETE', 'PV_AG', 'TAXE_FONCIERE', 'AUTRE'.
    Extrais les VALEURS CLÉS disponibles (Surface, Prix, Classe Énergétique, Propriétaire, Adresse).

    Retourne UNIQUEMENT un objet JSON respectant cette structure :
    {
      "type": "DPE" | "TITRE_PROPRIETE" | "PV_AG" | "TAXE_FONCIERE" | "AUTRE",
      "surface": number | null, // en m2
      "price": number | null, // en euros
      "energyClass": "A" | "B" | "C" | "D" | "E" | "F" | "G" | null,
      "address": string | null,
      "ownerName": string | null
    }
    `;

    try {
        const imagePart = await fileToGenerativePart(file);

        const result = await model.generateContent([systemPrompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonString) as ExtractedData;
    } catch (error) {
        console.error("Error processing document with Gemini:", error);
        return {
            type: 'AUTRE',
            // Return empty object or specific error state if needed
        };
    }
}
