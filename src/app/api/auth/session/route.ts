import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth-options';

export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json(session || { user: null });
}
