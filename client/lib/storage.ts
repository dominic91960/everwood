import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
const SUPABASE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET as string | undefined;

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  cachedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return cachedClient;
}

export function getSupabaseBucket(): string | undefined {
  return SUPABASE_BUCKET;
}

export async function uploadImageToSupabase(file: File, folder: string = 'blogs') {
  if (!SUPABASE_BUCKET) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_BUCKET');
  }
  const supabase = getSupabaseClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filePath);
  return { publicUrl: data.publicUrl, path: filePath };
}


