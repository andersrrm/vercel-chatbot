import { notFound, redirect } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';
import { getAssistantById } from '@/lib/db/assistant-queries';
import {
  AssistantUpdateForm,
  AssistantUpdatePageHeader,
} from '@/components/assistants';

interface EditAssistantPageProps {
  params: {
    assistantId: string;
  };
}

export default async function EditAssistantPage({
  params,
}: EditAssistantPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/sign-in?next=/assistants/${params.assistantId}/edit`);
  }

  // Get assistant data
  const assistant = await getAssistantById(params.assistantId);

  if (!assistant) {
    notFound();
  }

  // Check if assistant belongs to user
  if (assistant.userId !== session.user.id) {
    notFound();
  }

  return (
    <div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center"
    >
      <AssistantUpdatePageHeader />
      <AssistantUpdateForm assistant={assistant} />
    </div>
  );
}
