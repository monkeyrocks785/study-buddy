import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notes = await prisma.note.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
