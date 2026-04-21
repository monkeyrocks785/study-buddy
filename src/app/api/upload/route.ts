import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

const PRESET_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const subjectName = formData.get('subject') as string || 'General';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const randomColor = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];

    // Save to Database
    const note = await prisma.note.create({
      data: {
        name: file.name,
        subject: subjectName,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.name.split('.').pop() || 'file',
        url: `/uploads/${fileName}`,
        userId: session.user.id
      }
    });

    // Also ensure subject exists in subjects table
    await prisma.subject.upsert({
      where: { name_userId: { name: subjectName, userId: session.user.id } },
      update: {},
      create: { 
        name: subjectName, 
        userId: session.user.id,
        color: randomColor
      }
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
