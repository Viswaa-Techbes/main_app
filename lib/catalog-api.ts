/**
 * Techbes Catalog API — client-side helpers.
 * All functions fetch from the backend catalog endpoints.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || '';

export interface CatalogCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  color: string;
  gradient: string;
  isActive: boolean;
  sortOrder: number;
}

export interface BookingQuestion {
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'number' | 'image' | 'boolean' | 'date';
  options: string[];
  required: boolean;
  placeholder: string;
  sortOrder: number;
}

export interface CatalogPackage {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  duration: string;
  includes: string[];
  isPopular: boolean;
  isActive: boolean;
}

export interface CatalogSubCategory {
  _id: string;
  categoryId: string | { _id: string; name: string; slug: string };
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  bookingQuestions: BookingQuestion[];
  packages: CatalogPackage[];
  isActive: boolean;
  sortOrder: number;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'API returned failure');
  return data.data as T;
}

export async function fetchCategories(): Promise<CatalogCategory[]> {
  try {
    return await fetchJson<CatalogCategory[]>(`${BASE}/api/v2/catalog/categories`);
  } catch {
    return [];
  }
}

export async function fetchSubcategories(categorySlug: string): Promise<CatalogSubCategory[]> {
  try {
    const res = await fetchJson<{ data: CatalogSubCategory[] } & { data: any }>(`${BASE}/api/v2/catalog/categories/${categorySlug}/subcategories`);
    // The endpoint returns { success, data, category } — data is the subcategories
    return (res as any) as CatalogSubCategory[];
  } catch {
    return [];
  }
}

export async function fetchSubcategoryDetail(slug: string): Promise<CatalogSubCategory | null> {
  try {
    return await fetchJson<CatalogSubCategory>(`${BASE}/api/v2/catalog/subcategories/${slug}`);
  } catch {
    return null;
  }
}

export async function fetchPackages(subcategorySlug: string): Promise<CatalogPackage[]> {
  try {
    return await fetchJson<CatalogPackage[]>(`${BASE}/api/v2/catalog/subcategories/${subcategorySlug}/packages`);
  } catch {
    return [];
  }
}

export async function fetchBookingQuestions(subcategorySlug: string): Promise<BookingQuestion[]> {
  try {
    return await fetchJson<BookingQuestion[]>(`${BASE}/api/v2/catalog/subcategories/${subcategorySlug}/questions`);
  } catch {
    return [];
  }
}
