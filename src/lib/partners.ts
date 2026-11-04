import fallbackData from '@/data/fallbackPartners.json';

export interface FeaturedPartner {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  business_category: string | null;
  is_featured: boolean;
  logo: string | null;
  tagline: string | null;
}

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || "https://wcalmiziswrscyecllcl.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjYWxtaXppc3dyc2N5ZWNsbGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNzc2MTksImV4cCI6MjEwNzk1MzYxOX0.cCGOgDctbEg89_M-_4ZDACLXa6Nz_n5Fi662CFwNHio";

export async function getFeaturedPartners(): Promise<FeaturedPartner[]> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/stores?select=id,name,slug,city,business_category,is_featured,settings(logo,tagline)&is_featured=eq.true&is_active=eq.true&order=created_at.desc`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => {
          const setting = Array.isArray(item.settings) ? item.settings[0] : item.settings;
          return {
            id: item.id,
            name: item.name,
            slug: item.slug,
            city: item.city || null,
            business_category: item.business_category || null,
            is_featured: item.is_featured,
            logo: setting?.logo || null,
            tagline: setting?.tagline || null,
          };
        });
      }
    }
  } catch (error) {
    // Falls back seamlessly if offline or build environment has no external network
  }

  return fallbackData as FeaturedPartner[];
}
