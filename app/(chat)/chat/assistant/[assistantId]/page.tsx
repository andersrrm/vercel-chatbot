import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { auth } from '@/app/(auth)/auth';
import { getAssistantById } from '@/lib/db/assistant-queries';
import { log } from '@/lib/logger';
import type { AssistantChatPageProps, ChatComponentProps } from '@/lib/types';

const getAssistant = async (assistantId: string) => {
  try {
    const assistant = await getAssistantById(assistantId);
    if (!assistant) {
      log.info('Assistant not found, redirecting to home', { assistantId });
      redirect('/');
    }
    return assistant;
  } catch (error) {
    log.error('Failed to fetch assistant', { assistantId, error });
    redirect('/');
  }
};

const getChatModel = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('chat-model')?.value || DEFAULT_CHAT_MODEL;
};

const ChatComponent = ({
  id,
  session,
  assistant,
  model,
}: ChatComponentProps) => (
  <>
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      initialChatModel={model}
      initialVisibilityType="private"
      isReadonly={false}
      session={session}
      autoResume={false}
      assistant={assistant}
    />
    <DataStreamHandler id={id} />
  </>
);

export default async function AssistantChatPage({
  params,
}: AssistantChatPageProps) {
  const session = await auth();
  const { assistantId } = await params;

  const assistant = await getAssistant(assistantId);

  // Check assistant ownership
  if (assistant.userId !== session?.user?.id) {
    log.error('Assistant access denied');
    redirect('/');
  }

  const chatId = generateUUID();
  const chatModel = await getChatModel();

  return (
    <ChatComponent
      id={chatId}
      session={session}
      assistant={assistant}
      model={chatModel}
    />
  );
}
