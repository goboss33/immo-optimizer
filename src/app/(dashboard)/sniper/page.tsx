"use client";

import { useAdStore } from "@/store/useAdStore";
import AdCard from "@/components/AdCard";

export default function SniperPage() {
    const { ads } = useAdStore();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sniper Pige</h2>
                    <p className="text-muted-foreground mt-1">
                        Détectez les meilleures opportunités avant tout le monde.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full">
                        {ads.length} Annonces détectées
                    </span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ads.map((ad) => (
                    <AdCard
                        key={ad.id}
                        ad={ad}
                    />
                ))}
            </div>
        </div>
    );
}
