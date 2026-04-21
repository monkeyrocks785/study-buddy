import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const subjects = await prisma.subject.findMany({
      where: { userId: session.user.id },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching subjects' }, { status: 500 });
  }
}
