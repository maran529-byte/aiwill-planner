import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { orderClaimId, attribution, docType } = await req.json()

    if (!orderClaimId || typeof orderClaimId !== 'string') {
      return NextResponse.json({ error: 'Invalid orderClaimId' }, { status: 400 })
    }

    // Log the claim for blogger commission tracking
    // In production, store in database and associate with Stripe payment
    console.log('[OrderClaim]', {
      orderClaimId,
      attribution,
      docType,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Order claim registered',
      orderClaimId,
    })
  } catch (err) {
    console.error('[OrderClaim] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
