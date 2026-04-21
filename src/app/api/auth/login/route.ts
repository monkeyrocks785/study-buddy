import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const session = await encrypt({ user: { id: user.id, email: user.email, name: user.name }, expires });

    (await cookies()).set('session', session, { expires, httpOnly: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
