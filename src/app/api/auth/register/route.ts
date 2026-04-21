import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const session = await encrypt({ user: { id: user.id, email: user.email, name: user.name }, expires });

    (await cookies()).set('session', session, { expires, httpOnly: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
