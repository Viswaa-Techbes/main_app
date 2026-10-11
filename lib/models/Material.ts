// Interface types for Inventory Products
export interface IMaterial {
  _id: string;
  id?: string;
  name: string;
  brand?: string;
  category: string;
  subcategory?: string;
  modelNumber?: string;
  sku?: string;
  variant?: string;
  specifications?: string;
  unit?: string;
  price: number;
  basePrice?: number;
  gstRate: number;
  isTaxInclusive?: boolean;
  stock?: number;
  minStock?: number;
  image?: string;
  description?: string;
  status: 'active' | 'inactive';
}
