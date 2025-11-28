"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, Loader2, X, Eye } from 'lucide-react';
import { uploadFile } from '@/services/storageService';
import { processDocument } from '@/services/geminiService';
import { ExtractedData } from '@/types';

interface DocFile {
    id: string;
    file: File;
    preview: string;
    status: 'uploading' | 'analyzing' | 'done' | 'error';
    data?: ExtractedData;
}

export default function DocuBrainPage() {
    const [files, setFiles] = useState<DocFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<DocFile | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            preview: URL.createObjectURL(file),
            status: 'uploading' as const,
        }));

        setFiles(prev => [...prev, ...newFiles]);

        // Process each file
        for (const docFile of newFiles) {
            try {
                // 1. Upload
                await uploadFile(docFile.file);

                setFiles(prev => prev.map(f =>
                    f.id === docFile.id ? { ...f, status: 'analyzing' } : f
                ));

                // 2. Analyze
                const extractedData = await processDocument(docFile.file);

                setFiles(prev => prev.map(f =>
                    f.id === docFile.id ? {
                        ...f,
                        status: 'done',
                        data: extractedData
                    } : f
                ));
            } catch (error) {
                console.error("Error processing file:", error);
                setFiles(prev => prev.map(f =>
                    f.id === docFile.id ? { ...f, status: 'error' } : f
                ));
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'application/pdf': []
        }
    });

    const getTypeColor = (type?: string) => {
        switch (type) {
            case 'DPE': return 'bg-green-100 text-green-800';
            case 'TITRE_PROPRIETE': return 'bg-blue-100 text-blue-800';
            case 'FACTURE': return 'bg-yellow-100 text-yellow-800';
            case 'PLAN': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Docu-Brain 🧠</h2>
                <p className="text-gray-500 mt-2">
                    Analysez vos documents immobiliers en un clin d'œil.
                </p>
            </div>

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400 bg-white'}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-indigo-100 rounded-full text-indigo-600">
                        <Upload size={32} />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-900">
                            Glissez vos documents ici
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            PDF, JPG, PNG acceptés
                        </p>
                    </div>
                </div>
            </div>

            {/* File List */}
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {files.map((file) => (
                    <div
                        key={file.id}
                        onClick={() => file.status === 'done' && setSelectedFile(file)}
                        className={`bg-white rounded-lg border p-4 flex items-center space-x-4 transition-all
              ${file.status === 'done' ? 'cursor-pointer hover:shadow-md border-gray-200' : 'border-gray-100 opacity-80'}
            `}
                    >
                        <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {file.file.type.startsWith('image/') ? (
                                <img src={file.preview} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                    <FileText size={24} />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {file.file.name}
                            </p>
                            <div className="mt-1">
                                {file.status === 'uploading' && (
                                    <span className="text-xs text-blue-600 flex items-center">
                                        <Loader2 size={12} className="animate-spin mr-1" /> Upload...
                                    </span>
                                )}
                                {file.status === 'analyzing' && (
                                    <span className="text-xs text-purple-600 flex items-center">
                                        <Loader2 size={12} className="animate-spin mr-1" /> Analyse IA...
                                    </span>
                                )}
                                {file.status === 'done' && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(file.data?.type)}`}>
                                        {file.data?.type || 'Inconnu'}
                                    </span>
                                )}
                                {file.status === 'error' && (
                                    <span className="text-xs text-red-600">Erreur</span>
                                )}
                            </div>
                        </div>

                        {file.status === 'done' && (
                            <div className="text-gray-400">
                                <CheckCircle size={20} className="text-green-500" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Results Modal (Simple Overlay for now) */}
            {selectedFile && selectedFile.data && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedFile(null)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Analyse IA</h3>
                            <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden">
                                    <img src={selectedFile.preview} className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <span className={`text-sm font-bold px-2 py-1 rounded-full ${getTypeColor(selectedFile.data.type)}`}>
                                        {selectedFile.data.type}
                                    </span>
                                    <p className="text-sm text-gray-500 mt-1">Confiance: Haute</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase">Surface</p>
                                    <p className="font-semibold text-gray-900">{selectedFile.data.surface ? `${selectedFile.data.surface} m²` : 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase">Prix</p>
                                    <p className="font-semibold text-gray-900">{selectedFile.data.price ? `${selectedFile.data.price} €` : 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase">DPE</p>
                                    <p className="font-semibold text-gray-900">{selectedFile.data.energyClass || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase">Propriétaire</p>
                                    <p className="font-semibold text-gray-900">{selectedFile.data.ownerName || 'N/A'}</p>
                                </div>
                            </div>

                            {selectedFile.data.address && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase">Adresse détectée</p>
                                    <p className="font-medium text-gray-900">{selectedFile.data.address}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                            <button
                                className="text-indigo-600 font-medium text-sm hover:underline"
                                onClick={() => setSelectedFile(null)}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
