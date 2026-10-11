import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Material } from '@/lib/models/Material';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const rawQuery = String(searchParams.get('q') || searchParams.get('search') || '').trim();
    const category = String(searchParams.get('category') || '').trim();

    // Auto-seed initial catalog items if Material collection has 0 items
    const count = await Material.countDocuments();
    if (count === 0) {
      console.log('[Inventory Search] Seeding initial inventory products...');
      await Material.create([
        {
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
      ]);
    }

    const filter: any = { status: 'active' };

    if (category && category !== 'All' && category !== 'all') {
      if (category.toLowerCase().includes('cctv')) {
        filter.category = { $regex: /cctv/i };
      } else if (category.toLowerCase().includes('network')) {
        filter.category = { $regex: /network/i };
      } else {
        filter.category = { $regex: new RegExp(category, 'i') };
      }
    }

    if (rawQuery) {
      const escaped = rawQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escaped, 'i');
      filter.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { modelNumber: searchRegex },
        { sku: searchRegex },
        { variant: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
        { 'variants.name': searchRegex },
        { 'variants.sku': searchRegex },
      ];
    }

    const items = await Material.find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .limit(30)
      .lean();

    const formatted = items.map((item) => {
      const basePrice = typeof item.basePrice === 'number' ? item.basePrice : (item.price || 0);
      const gstRate = typeof item.gstRate === 'number' ? item.gstRate : 18;

      return {
        _id: String(item._id),
        id: String(item._id),
        name: item.name,
        brand: item.brand || '',
        category: item.category || 'General',
        subcategory: item.subcategory || '',
        modelNumber: item.modelNumber || '',
        sku: item.sku || '',
        variant: item.variant || '',
        specifications: item.specifications || '',
        basePrice,
        price: basePrice,
        gstRate,
        isTaxInclusive: Boolean(item.isTaxInclusive),
        stock: typeof item.stock === 'number' ? item.stock : 0,
        unit: item.unit || 'each',
        image: item.image || '',
        description: item.description || '',
        variants: item.variants || [],
      };
    });

    return NextResponse.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (err: any) {
    console.error('Inventory search error in Next.js API:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
