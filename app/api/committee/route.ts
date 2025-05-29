import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    
    const committeeMembers = [
      {
        name: "Charlotte Brown",
        role: "Chairperson",
        email: "chair@veraimperia.com",
        phone: "0496378421",
        responsibilities: "Oversees all committee activities, chairs meetings, and represents the community in external affairs.",
        image: "Charlotte.jpeg",
      },
      {
        name: "Maria Anderson",
        role: "Secretary",
        email: "secretary@veraimperia.com",
        phone: "0478937346",
        responsibilities: "Manages all communication, maintains records and minutes of meetings, and coordinates with property management.",
        image: "Maria.jpeg",
      },
      {
        name: "James Smith",
        role: "Treasurer",
        email: "treasurer@veraimperia.com",
        phone: "0485463672",
        responsibilities: "Oversees financial affairs, maintains budget, processes payments, and provides financial reports.",
        image: "James.jpeg",
      },
      {
        name: "Isabelle Oliver",
        role: "Maintenance Coordinator",
        email: "maintenance@veraimperia.com",
        phone: "0412345678",
        responsibilities: "Coordinates all maintenance activities, inspections, and supervises contractors and vendors.",
        image: "Isabelle.jpeg",
      },
      {
        name: "Liam Johnson",
        role: "Security Coordinator",
        email: "security@veraimperia.com",
        phone: "0412389045",
        responsibilities: "Supervises security personnel, implements security protocols, and addresses security concerns.",
        image: "Liam.jpeg",
      },
    ];

    return NextResponse.json({ committeeMembers });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch committee members' },
      { status: 500 }
    );
  }
} 