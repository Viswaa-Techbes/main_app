import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Material } from '@/lib/models/Material';

function roundCurrency(amount: number): number {
  return Math.round((Number(amount) || 0) * 100) / 100;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Items array is required' }, { status: 400 });
    }

    let subtotal = 0;
    let totalGst = 0;
    const processedItems = [];

    for (const item of items) {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      let authoritativeProduct = null;

      if (item.productId) {
        try {
          authoritativeProduct = await Material.findById(item.productId).lean();
        } catch (_) {}
      }

      let basePrice = 0;
      let gstRate = 18;
      let isTaxInclusive = false;
      let productName = String(item.productName || item.name || '').trim();
      let brand = '';
      let sku = '';
      let variantName = String(item.variant || '').trim();

      if (authoritativeProduct) {
        basePrice = typeof authoritativeProduct.basePrice === 'number'
          ? authoritativeProduct.basePrice
          : (authoritativeProduct.price || 0);
        gstRate = typeof authoritativeProduct.gstRate === 'number'
          ? authoritativeProduct.gstRate
          : 18;
        isTaxInclusive = Boolean(authoritativeProduct.isTaxInclusive);
        productName = authoritativeProduct.name;
        brand = authoritativeProduct.brand || '';
        sku = authoritativeProduct.sku || '';

        if (variantName && Array.isArray(authoritativeProduct.variants)) {
          const matchedVariant = authoritativeProduct.variants.find(
            (v: any) => v.name === variantName || v.sku === variantName
          );
          if (matchedVariant && typeof matchedVariant.price === 'number') {
            basePrice = matchedVariant.price;
            sku = matchedVariant.sku || sku;
          }
        }
      } else {
        basePrice = Math.max(0, Number(item.unitPrice || item.basePrice || 0));
        gstRate = typeof item.gstRate === 'number' ? item.gstRate : 18;
      }

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
        productId: authoritativeProduct?._id ? String(authoritativeProduct._id) : (item.productId || null),
        productName,
        brand,
        sku,
        variant: variantName,
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
