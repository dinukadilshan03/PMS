import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/bookings/config`);
    if (!response.ok) {
      throw new Error('Failed to fetch booking configuration');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const newConfig = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/bookings/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newConfig),
    });

    if (!response.ok) {
      throw new Error('Failed to update booking configuration');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update configuration' }, { status: 500 });
  }
} 