import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import {
  softDeleteAssistant,
  updateAssistant,
  getAssistantById,
} from '@/lib/db/assistant-queries';
import { createAssistantSchema } from '@/lib/validations/assistant';
import type { AssistantRouteParams } from '@/lib/types';

const createErrorResponse = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

const validateSession = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
};

const validateAssistantOwnership = async (
  assistantId: string,
  userId: string,
) => {
  const assistant = await getAssistantById(assistantId);
  if (!assistant || assistant.userId !== userId) {
    throw new Error('Assistant not found');
  }
  return assistant;
};

export async function DELETE(
  request: NextRequest,
  { params }: AssistantRouteParams,
) {
  try {
    const session = await validateSession();
    const { assistantId } = await params;

    const deletedAssistant = await softDeleteAssistant(
      assistantId,
      session.user.id,
    );

    if (!deletedAssistant) {
      return createErrorResponse('Assistant not found', 404);
    }

    return NextResponse.json({ success: true, assistant: deletedAssistant });
  } catch (error) {
    console.error('Error deleting assistant:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: AssistantRouteParams,
) {
  try {
    const session = await validateSession();
    const { assistantId } = await params;

    await validateAssistantOwnership(assistantId, session.user.id);

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
      return createErrorResponse('Failed to update assistant', 500);
    }

    return NextResponse.json(updatedAssistant);
  } catch (error) {
    console.error('Error updating assistant:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
