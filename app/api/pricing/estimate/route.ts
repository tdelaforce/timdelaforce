import { NextRequest, NextResponse } from "next/server";

// STUB: Replace with real pricing logic in v2
// This is the single source of truth for pricing.
// The chat widget, admin dashboard, and any future tools all call this endpoint.

export interface PricingInput {
  platingType: string;
  dimensions?: string;
  quantity?: number;
  material?: string;
  turnaround?: string;
  specialHandling?: string;
}

export interface PricingOutput {
  estimatedPrice: number | null;
  currency: string;
  breakdown: Record<string, number | string>;
  pricingVersion: string;
  note?: string;
}

export async function POST(req: NextRequest) {
  const input: PricingInput = await req.json();

  // TODO: Replace this stub with real logic migrated from the prototype artifact
  const estimate: PricingOutput = {
    estimatedPrice: null,
    currency: "USD",
    breakdown: {
      base: "TBD",
      quantity_adjustment: "TBD",
      turnaround_adjustment: "TBD",
    },
    pricingVersion: "0.0.1-stub",
    note: "Pricing engine is in development. Admin will set final price.",
  };

  return NextResponse.json(estimate);
}
