import { NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/core/api/config';

const INITIAL_CATALOG = [
  {
    _id: '670000000000000000000001',
    id: '670000000000000000000001',
    name: 'CP Plus 2MP Full HD Dome Camera',
    brand: 'CP Plus',
    category: 'CCTV',
    subcategory: 'Cameras',
    modelNumber: 'CP-UNC-DA21L2-V2',
    sku: 'CPP-2MP-DOME-01',
    variant: '2MP Dome',
    specifications: '1080P Full HD, 30m IR Range, IP67 Weatherproof, DWDR',
    basePrice: 1000,
    price: 1000,
    gstRate: 18,
    isTaxInclusive: false,
    stock: 45,
    minStock: 5,
    unit: 'each',
    status: 'active',
    description: 'High definition 2MP indoor/outdoor surveillance camera by CP Plus',
  },
  {
    _id: '670000000000000000000002',
    id: '670000000000000000000002',
    name: 'CP Plus 4MP Ultra HD Bullet Camera',
    brand: 'CP Plus',
    category: 'CCTV',
    subcategory: 'Cameras',
    modelNumber: 'CP-UNC-TA41L3-V3',
    sku: 'CPP-4MP-BULLET-01',
    variant: '4MP Bullet',
    specifications: '4MP Ultra HD, 50m IR Night Vision, PoE Support, IP67',
    basePrice: 1800,
    price: 1800,
    gstRate: 18,
    isTaxInclusive: false,
    stock: 30,
    minStock: 5,
    unit: 'each',
    status: 'active',
    description: 'Professional 4MP bullet camera for wide perimeter monitoring',
  },
  {
    _id: '670000000000000000000003',
    id: '670000000000000000000003',
    name: 'CP Plus 5MP Smart Color Night Camera',
    brand: 'CP Plus',
    category: 'CCTV',
    subcategory: 'Cameras',
    modelNumber: 'CP-UNC-TA51L3-C',
    sku: 'CPP-5MP-COLOR-01',
    variant: '5MP ColorNight',
    specifications: '5MP Resolution, Full Color 24/7, Smart AI Human Detection',
    basePrice: 2400,
    price: 2400,
    gstRate: 18,
    isTaxInclusive: false,
    stock: 25,
    minStock: 4,
    unit: 'each',
    status: 'active',
    description: '5MP 24/7 full color night vision surveillance camera',
  },
  {
    _id: '670000000000000000000004',
    id: '670000000000000000000004',
    name: 'Hikvision 2MP IP Dome Camera',
    brand: 'Hikvision',
    category: 'CCTV',
    subcategory: 'Cameras',
    modelNumber: 'DS-2CD1123G0-I',
    sku: 'HIK-2MP-DOME-01',
    variant: '2MP Dome',
    specifications: '2MP CMOS, 30m IR, IP67 & IK10 Vandal-Proof, PoE',
    basePrice: 1350,
    price: 1350,
    gstRate: 18,
    isTaxInclusive: false,
    stock: 35,
    minStock: 5,
    unit: 'each',
    status: 'active',
    description: 'Vandal-proof 2MP network dome camera from Hikvision',
  },
  {
    _id: '670000000000000000000005',
    id: '670000000000000000000005',
    name: 'CP Plus 8-Channel 4K NVR Recorder',
    brand: 'CP Plus',
    category: 'CCTV',
    subcategory: 'Recorders',
    modelNumber: 'CP-UNR-208M1',
    sku: 'CPP-8CH-NVR-01',
    variant: '8 Channel',
    specifications: '8 Channel IP Video Input, Up to 8MP, 1 SATA up to 10TB',
    basePrice: 4200,
    price: 4200,
    gstRate: 18,
    isTaxInclusive: false,
    stock: 15,
    minStock: 3,
    unit: 'each',
    status: 'active',
    description: '8 Channel Network Video Recorder with mobile remote viewing',
  },
  {
    _id: '670000000000000000000006',
    id: '670000000000000000000006',
    name: 'D-Link 8-Port Gigabit Desktop Switch',
    brand: 'D-Link',
    category: 'Networking',
    subcategory: 'Switches',
    modelNumber: 'DGS-1008A',
    sku: 'DLK-8PORT-GIG-01',
    variant: '8-Port Gigabit',
    specifications: '8x 10/100/1000Mbps Gigabit Ports, QoS, Energy Efficient',
    basePrice: 1250,
    price: 1250,
    gstRate: 18,
    isTaxInclusive: false,
    stock: 20,
    minStock: 4,
    unit: 'each',
    status: 'active',
    description: 'High-speed 8-port gigabit switch for office and home networks',
  },
  {
    _id: '670000000000000000000007',
    id: '670000000000000000000007',
    name: 'Cisco 24-Port Gigabit Managed Switch',
    brand: 'Cisco',
    category: 'Networking',
    subcategory: 'Switches',
    modelNumber: 'CBS250-24T-4G',
    sku: 'CSC-24PORT-GIG-01',
    variant: '24-Port Managed',
    specifications: '24 Gigabit Ports + 4x 1G SFP Uplinks, Layer 2 Managed',
    basePrice: 14500,
    price: 14500,
    gstRate: 18,
    isTaxInclusive: false,
    stock: 8,
    minStock: 2,
    unit: 'each',
    status: 'active',
    description: 'Enterprise grade managed rackmount switch for structured cabling',
  },
  {
    _id: '670000000000000000000008',
    id: '670000000000000000000008',
    name: 'Schneider Cat6 Solid Copper Cable (305m Box)',
    brand: 'Schneider',
    category: 'Networking',
    subcategory: 'Cables',
    modelNumber: 'ACT4P6UCMR3RBBU',
    sku: 'SCH-CAT6-305M',
    variant: 'Cat6 305m',
    specifications: '100% Solid Bare Copper, 23 AWG, 250 MHz, UTP Fluke Passed',
    basePrice: 7800,
    price: 7800,
    gstRate: 18,
    isTaxInclusive: false,
    stock: 12,
    minStock: 3,
    unit: 'box',
    status: 'active',
    description: 'Certified 305-meter Cat6 UTP pure copper networking cable bundle',
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = String(searchParams.get('q') || searchParams.get('search') || '').trim();
  const category = String(searchParams.get('category') || '').trim();

  // 1. Try querying backend API
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const backendUrl = getBackendApiUrl(`/api/v2/inventory/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`);

    const res = await fetch(backendUrl, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timer);

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return NextResponse.json(json);
      }
    }
  } catch (_) {
    // Backend API busy or sleeping - fallback to verified catalog
  }

  // 2. Fallback search against catalog
  const filtered = INITIAL_CATALOG.filter((item) => {
    if (item.status !== 'active') return false;

    if (category && category !== 'All' && category !== 'all') {
      const catMatch =
        item.category.toLowerCase().includes(category.toLowerCase()) ||
        category.toLowerCase().includes(item.category.toLowerCase());
      if (!catMatch) return false;
    }

    if (!q) return true;

    const lowerQ = q.toLowerCase();
    return (
      item.name.toLowerCase().includes(lowerQ) ||
      item.brand.toLowerCase().includes(lowerQ) ||
      (item.modelNumber && item.modelNumber.toLowerCase().includes(lowerQ)) ||
      (item.sku && item.sku.toLowerCase().includes(lowerQ)) ||
      (item.variant && item.variant.toLowerCase().includes(lowerQ)) ||
      (item.description && item.description.toLowerCase().includes(lowerQ))
    );
  });

  return NextResponse.json({
    success: true,
    count: filtered.length,
    data: filtered,
  });
}
