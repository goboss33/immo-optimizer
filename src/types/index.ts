export type UrgencyScore = number; // 0-100

export interface AnalysisResult {
  urgencyScore: UrgencyScore;
  urgencyReasoning: string; // Pourquoi ce score ?
  suggestedOutreach: {
    sms: string;
    emailSubject: string;
    emailBody: string;
  };
  enrichedAddress?: {
    street?: string;
    city: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export interface PropertyAd {
  id: string;
  sourceUrl: string;
  sourcePlatform: string; // 'leboncoin', 'seloger', etc.
  title: string;
  description: string;
  price: number;
  location: string;
  publishedAt: Date;
  scrapedAt: Date;
  images: string[];
  isAnalyzed: boolean;
  analysis?: AnalysisResult;
}

export interface Lead {
  id: string;
  adId: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'archived';
  contactInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  analysis?: AnalysisResult;
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentType = 'DPE' | 'TITRE_PROPRIETE' | 'PV_AG' | 'TAXE_FONCIERE' | 'AUTRE';

export interface ExtractedData {
  surface?: number;
  price?: number;
  energyClass?: string; // A, B, C...
  gesClass?: string;
  address?: string;
  ownerName?: string;
  [key: string]: any; // Flexibilité pour d'autres champs
}

export interface RealEstateDocument {
  id: string;
  originalName: string;
  processedName?: string; // ex: 2024-05_DPE_Appartement.pdf
  url: string; // URL Supabase Storage
  type: DocumentType;
  status: 'pending' | 'processing' | 'completed' | 'error';
  extractedData?: ExtractedData;
  uploadedAt: Date;
  processedAt?: Date;
}
