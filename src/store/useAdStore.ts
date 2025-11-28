import { create } from 'zustand';
import { PropertyAd } from '@/types';

interface AdStore {
  ads: PropertyAd[];
  isLoading: boolean;
  setAds: (ads: PropertyAd[]) => void;
  updateAd: (id: string, updates: Partial<PropertyAd>) => void;
}

const MOCK_ADS: PropertyAd[] = [
  {
    id: '1',
    sourceUrl: 'https://www.leboncoin.fr/ventes_immobilieres/123456789.htm',
    sourcePlatform: 'leboncoin',
    title: 'Maison familiale urgente cause divorce',
    description: 'Vends rapidement maison 120m2, 4 chambres, jardin. Travaux de rafraichissement à prévoir. Prix négociable si vente rapide. Cause séparation. Visites possibles ce week-end.',
    price: 280000,
    location: 'Bordeaux (33000)',
    publishedAt: new Date('2023-11-28T10:00:00'), // Fixed date
    scrapedAt: new Date('2023-11-28T12:00:00'),
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'],
    isAnalyzed: false,
  },
  {
    id: '2',
    sourceUrl: 'https://www.seloger.com/annonces/achat/appartement/paris-11eme-75/123456.htm',
    sourcePlatform: 'seloger',
    title: 'Appartement idéal investisseur',
    description: 'Studio 25m2 vendu loué. Rentabilité 5%. Quartier recherché. Proche métro. Faibles charges. Idéal premier investissement ou déficit foncier.',
    price: 185000,
    location: 'Paris 11ème (75011)',
    publishedAt: new Date('2023-11-27T14:30:00'), // Fixed date
    scrapedAt: new Date('2023-11-28T09:00:00'),
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
    isAnalyzed: false,
  },
  {
    id: '3',
    sourceUrl: 'https://www.pap.fr/annonce/vente-maison-lyon-69-g12345',
    sourcePlatform: 'pap',
    title: 'Grande maison de caractère',
    description: 'Belle demeure de 250m2. Prestations haut de gamme. Aucun travaux. Prix ferme. Agences s\'abstenir. Curieux s\'abstenir.',
    price: 850000,
    location: 'Lyon (69006)',
    publishedAt: new Date('2023-11-26T08:15:00'), // Fixed date
    scrapedAt: new Date('2023-11-28T11:00:00'),
    images: ['https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?auto=format&fit=crop&w=800&q=80'],
    isAnalyzed: false,
  },
];

export const useAdStore = create<AdStore>((set) => ({
  ads: MOCK_ADS, // Initialize with mock data
  isLoading: false,
  setAds: (ads) => set({ ads }),
  updateAd: (id, updates) =>
    set((state) => ({
      ads: state.ads.map((ad) => (ad.id === id ? { ...ad, ...updates } : ad)),
    })),
}));
