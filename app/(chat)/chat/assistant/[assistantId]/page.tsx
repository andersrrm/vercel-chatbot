import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { auth } from '@/app/(auth)/auth';
import { getAssistantById } from '@/lib/db/assistant-queries';
import { log } from '@/lib/logger';

interface AssistantChatPageProps {
  params: Promise<{ assistantId: string }>;
}

export default async function AssistantChatPage({
  params,
}: AssistantChatPageProps) {
  const session = await auth();

  if (!session) {
    log.error('No session found', { redirectTo: '/api/auth/guest' });
    redirect('/api/auth/guest');
  }

  const { assistantId } = await params;

  // Get assistant data
  let assistant = null;
  try {
    assistant = await getAssistantById(assistantId);
  } catch (error) {
    log.error('Failed to fetch assistant', {
      assistantId,
      userId: session.user.id,
      error,
    });
    redirect('/');
  }

  if (!assistant) {
    log.info('Assistant not found, redirecting to home', {
      assistantId,
      userId: session.user.id,
    });
    redirect('/');
  }

  // Check assistant ownership
  if (assistant.userId !== session.user.id) {
    log.error('Assistant access denied - does not belong to user', {
      assistantId,
      assistantUserId: assistant.userId,
      currentUserId: session.user.id,
    });
    redirect('/');
  }

  log.info('Assistant chat page loaded successfully', {
    assistantId,
    assistantName: assistant.name,
    userId: session.user.id,
  });

  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialVisibilityType="private"
          isReadonly={false}
          session={session}
          autoResume={false}
          assistant={assistant}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={modelIdFromCookie.value}
        initialVisibilityType="private"
        isReadonly={false}
        session={session}
        autoResume={false}
        assistant={assistant}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
