import { NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/core/api/config';

function roundCurrency(amount: number): number {
  return Math.round((Number(amount) || 0) * 100) / 100;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Items array is required' }, { status: 400 });
    }

    // 1. Attempt to call authoritative BE API calculation
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);
      const backendUrl = getBackendApiUrl('/api/v2/inventory/calculate-gst');
      const beRes = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timer);
      if (beRes.ok) {
        const beJson = await beRes.json();
        if (beJson.success) {
          return NextResponse.json(beJson);
        }
      }
    } catch (_) {
      // Backend busy or offline, perform standard tax calculation locally
    }

    // 2. Perform authoritative standard GST calculation
    let subtotal = 0;
    let totalGst = 0;
    const processedItems = [];

    for (const item of items) {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const basePrice = Math.max(0, Number(item.unitPrice ?? item.basePrice ?? item.price ?? 0));
      const gstRate = typeof item.gstRate === 'number' ? item.gstRate : 18;
      const isTaxInclusive = Boolean(item.isTaxInclusive);

      let taxableAmount = 0;
      let gstAmount = 0;
      let lineTotal = 0;

      if (isTaxInclusive) {
        lineTotal = roundCurrency(basePrice * qty);
        taxableAmount = roundCurrency(lineTotal / (1 + gstRate / 100));
        gstAmount = roundCurrency(lineTotal - taxableAmount);
      } else {
        taxableAmount = roundCurrency(basePrice * qty);
        gstAmount = roundCurrency((taxableAmount * gstRate) / 100);
        lineTotal = roundCurrency(taxableAmount + gstAmount);
      }

      subtotal += taxableAmount;
      totalGst += gstAmount;

      const halfRate = gstRate / 2;
      const cgstAmount = roundCurrency(gstAmount / 2);
      const sgstAmount = roundCurrency(gstAmount - cgstAmount);

      processedItems.push({
        productId: item.productId || null,
        productName: item.productName || item.name || '',
        brand: item.brand || '',
        sku: item.sku || '',
        variant: item.variant || '',
        quantity: qty,
        unitBasePrice: basePrice,
        gstRate,
        isTaxInclusive,
        taxableAmount,
        gstAmount,
        cgstRate: halfRate,
        cgstAmount,
        sgstRate: halfRate,
        sgstAmount,
        lineTotal,
      });
    }

    subtotal = roundCurrency(subtotal);
    totalGst = roundCurrency(totalGst);
    const finalAmount = roundCurrency(subtotal + totalGst);

    const halfTotalGst = roundCurrency(totalGst / 2);
    const sgstTotal = roundCurrency(totalGst - halfTotalGst);

    return NextResponse.json({
      success: true,
      data: {
        items: processedItems,
        subtotal,
        totalGst,
        cgstTotal: halfTotalGst,
        sgstTotal,
        finalAmount,
        currency: 'INR',
      },
    });
  } catch (err: any) {
    console.error('Calculate GST API error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
