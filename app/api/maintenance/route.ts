import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.fullName || !data.unitNumber || !data.contactNumber || !data.email || !data.serviceType || !data.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

  
    return NextResponse.json(
      { 
        success: true,
        message: 'Maintenance request submitted successfully',
        requestId: Math.random().toString(36).substring(7)
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit maintenance request' },
      { status: 500 }
    );
  }
} 