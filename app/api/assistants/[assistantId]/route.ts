import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import {
  softDeleteAssistant,
  updateAssistant,
  getAssistantById,
} from '@/lib/db/assistant-queries';
import { createAssistantSchema } from '@/lib/validations/assistant';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ assistantId: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assistantId } = await params;

    const deletedAssistant = await softDeleteAssistant(
      assistantId,
      session.user.id,
    );

    if (!deletedAssistant) {
      return NextResponse.json(
        { error: 'Assistant not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, assistant: deletedAssistant });
  } catch (error) {
    console.error('Error deleting assistant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ assistantId: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assistantId } = await params;

    // Check if assistant exists and belongs to user
    const existingAssistant = await getAssistantById(assistantId);
    if (!existingAssistant || existingAssistant.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Assistant not found' },
        { status: 404 },
      );
    }

    const json = await request.json();
    const { name, instructions, avatar } = createAssistantSchema.parse(json);

    const updatedAssistant = await updateAssistant(
      assistantId,
      session.user.id,
      {
        name,
        instructions,
        avatar,
      },
    );

    if (!updatedAssistant) {
      return NextResponse.json(
        { error: 'Failed to update assistant' },
        { status: 500 },
      );
    }

    return NextResponse.json(updatedAssistant);
  } catch (error) {
    console.error('Error updating assistant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
