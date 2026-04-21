import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, subject, due } = await request.json();

    const task = await prisma.task.create({
      data: {
        title,
        subject,
        due,
        userId: session.user.id
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating task' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, completed } = await request.json();

    const task = await prisma.task.update({
      where: { id, userId: session.user.id },
      data: { completed }
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating task' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await request.json();

    await prisma.task.delete({
      where: { id, userId: session.user.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting task' }, { status: 500 });
  }
}
