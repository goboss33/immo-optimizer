import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export async function uploadFile(file: File, bucket: string = 'documents', path?: string): Promise<string | null> {
    // Mock implementation for demo if Supabase is not configured
    if (!supabase) {
        console.warn("Supabase not configured. Using mock upload.");
        return new Promise((resolve) => {
            setTimeout(() => {
                // Return a fake URL or a blob URL for local preview
                const mockUrl = URL.createObjectURL(file);
                resolve(mockUrl);
            }, 1500); // Simulate network delay
        });
    }

    try {
        const filePath = path || `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (error) {
            console.error("Supabase upload error:", error);
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
}
