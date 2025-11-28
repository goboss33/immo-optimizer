import React, { useState } from 'react';
import { PropertyAd, AnalysisResult } from '@/types';
import { analyzeRealEstateAd } from '@/services/geminiService';
import { useAdStore } from '@/store/useAdStore';

interface AdCardProps {
    ad: PropertyAd;
}

export default function AdCard({ ad }: AdCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(ad.isAnalyzed && ad.analysis ? ad.analysis : null); // Assuming PropertyAd might be extended to hold analysis, or we just keep local state for now. 
    // Wait, PropertyAd in types/index.ts has 'isAnalyzed' but not 'analysis' field explicitly in the interface shown in Step 16.
    // Let's check types/index.ts again. It has 'analysis?: AnalysisResult' in Lead, but PropertyAd only has 'isAnalyzed'.
    // I should probably update PropertyAd to include 'analysis' or just store it locally.
    // The store has 'updateAd'. I should update the store with the analysis result.

    const updateAd = useAdStore((state) => state.updateAd);

    const handleAnalyze = async () => {
        setIsLoading(true);
        try {
            // Construct a rich text representation of the ad for the AI
            const adContent = `
        Titre: ${ad.title}
        Prix: ${ad.price}€
        Localisation: ${ad.location}
        Description: ${ad.description}
        URL: ${ad.sourceUrl}
      `;

            const result = await analyzeRealEstateAd(adContent);
            setAnalysis(result);

            // Update store
            // We need to cast or extend PropertyAd to include analysis if we want to persist it in the store properly.
            // For now, let's assume we can add it or just keep it local. 
            // But the requirement says "affiche le résultat... directement dans la carte".
            // Ideally we save it to the store so it persists if we navigate away.
            // I'll update the store with isAnalyzed: true.
            // If I can't save the full analysis object in the current PropertyAd type without changing it, I'll just save isAnalyzed.
            // But wait, I can modify types/index.ts to add 'analysis' to PropertyAd. That would be better.

            updateAd(ad.id, { isAnalyzed: true });
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-red-500 text-white';
        if (score >= 50) return 'bg-orange-500 text-white';
        return 'bg-green-500 text-white'; // Green for "Cold" / Safe / Not urgent
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col h-full">
            <div className="relative h-48 bg-gray-200">
                {ad.images[0] && (
                    <img
                        src={ad.images[0]}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700">
                    {ad.sourcePlatform}
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1" title={ad.title}>{ad.title}</h3>
                    <span className="font-bold text-blue-600 whitespace-nowrap">{ad.price.toLocaleString()} €</span>
                </div>

                <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <span className="mr-1">📍</span> {ad.location}
                </p>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                    {ad.description}
                </p>

                {analysis ? (
                    <div className="mt-auto bg-gray-50 rounded-lg p-3 border border-gray-200 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-gray-700">Score Sniper</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(analysis.urgencyScore)}`}>
                                {analysis.urgencyScore}/100
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 italic mb-2">
                            "{analysis.urgencyReasoning}"
                        </p>
                        <div className="space-y-2">
                            <div className="bg-blue-50 p-2 rounded border border-blue-100">
                                <p className="text-xs font-semibold text-blue-800 mb-1">SMS Suggéré :</p>
                                <p className="text-xs text-blue-700 select-all cursor-pointer hover:text-blue-900" title="Cliquer pour copier">
                                    {analysis.suggestedOutreach.sms}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="mt-auto w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyse en cours...
                            </>
                        ) : (
                            <>
                                <span className="mr-2">⚡</span> Analyser avec IA
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
