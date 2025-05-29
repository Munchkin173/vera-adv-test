import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.cardNumber || !data.expiryDate || !data.cvv || !data.cardName || !data.selectedService || !data.amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    

    return NextResponse.json(
      { 
        success: true,
        message: 'Payment processed successfully',
        transactionId: Math.random().toString(36).substring(7)
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
} 