import { PropertyAd } from '@/types';
import { useState } from 'react';
import { Loader2, Sparkles, MapPin, Euro, Clock } from 'lucide-react';

interface AdCardProps {
    ad: PropertyAd;
    onAnalyze: (id: string) => Promise<void>;
}

export function AdCard({ ad, onAnalyze }: AdCardProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyzeClick = async () => {
        setIsAnalyzing(true);
        try {
            await onAnalyze(ad.id);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-red-100 text-red-800 border-red-200'; // Hot
        if (score >= 50) return 'bg-orange-100 text-orange-800 border-orange-200'; // Medium
        return 'bg-green-100 text-green-800 border-green-200'; // Cold
    };

    return (
        <div className="flex flex-col h-full bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            {/* Image Header */}
            <div className="relative h-48 bg-gray-100">
                {ad.images && ad.images.length > 0 ? (
                    <img
                        src={ad.images[0]}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-md shadow-sm">
                        {ad.sourcePlatform}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-5 space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1" title={ad.title}>
                        {ad.title}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                            <Euro className="w-4 h-4 mr-1" />
                            {ad.price.toLocaleString('fr-FR')} €
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {ad.location}
                        </div>
                    </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 flex-grow">
                    {ad.description}
                </p>

                {/* Analysis Section */}
                {ad.isAnalyzed && ad.analysis ? (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Urgency Score</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getScoreColor(ad.analysis.urgencyScore)}`}>
                                {ad.analysis.urgencyScore}/100
                            </span>
                        </div>

                        <div className="text-xs text-gray-600">
                            <span className="font-semibold text-gray-900">Analyse: </span>
                            {ad.analysis.urgencyReasoning}
                        </div>

                        <div className="pt-2 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-500 mb-1">Suggestion SMS:</p>
                            <div className="p-2 bg-white rounded border border-gray-200 text-xs text-gray-600 italic">
                                "{ad.analysis.suggestedOutreach.sms}"
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-auto pt-4">
                        <button
                            onClick={handleAnalyzeClick}
                            disabled={isAnalyzing}
                            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyse en cours...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Analyser avec IA
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
